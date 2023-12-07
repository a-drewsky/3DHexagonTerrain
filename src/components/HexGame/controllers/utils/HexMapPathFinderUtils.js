import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class HexMapPathFinderUtilsClass {

    constructor(gameData) {

        this.mapData = gameData.mapData
        this.tileData = gameData.tileData
        this.unitData = gameData.unitData
        this.structureData = gameData.structureData

        this.commonUtils = new CommonHexMapUtilsClass()

    }

    createNode = (pos) => {
        return {
            tile: { ...pos },
            connection: null,
            moveCost: null,
            estimateCost: null
        }
    }

    GetF = (node) => {
        return node.moveCost + node.estimateCost
    }

    createNeighborNodes = (tile) => {
        let neighbors = this.tileData.getNeighborKeys(tile, 1)

        return neighbors.map(neighbor => this.createNode(neighbor))
    }

    getHeightDifference = (tile1, tile2) => {
        return Math.abs(this.tileData.getEntry(tile1).height - this.tileData.getEntry(tile2).height)
    }

    getTileCost = (tileObj) => {
        return this.unitData.selectedUnit.stats['movement_cost'][tileObj.biomeRegion]
    }

    getPathCost = (unitPos, path) => {
        let cost = 0
        let testPath = [unitPos, ...path]
        for(let i=1; i<testPath.length; i++){
            let tile = testPath[i]
            cost += this.getTileCost(tile) + this.getHeightDifference(testPath[i-1], testPath[i])
        }

        return cost
    }

    getMoveSet = (start, moveAmount) => {
        let startNode = this.createNode(start)

        let toSearch = [startNode]
        let processed = []

        while (toSearch.length > 0) {
            let current = toSearch[0]

            for (let t of toSearch) {
                if (t.moveCost < current.moveCost){
                    current = t
                } 
            }

            processed.push(current)
            let currentToSearchIndex = toSearch.findIndex(node => node.tile.q === current.tile.q && node.tile.r === current.tile.r)
            toSearch.splice(currentToSearchIndex, 1)

            //Get Neighbors
            let neighbors = this.createNeighborNodes(current.tile)
            neighbors = neighbors.filter(neighbor => this.validatePathTile(neighbor.tile) === true)
            neighbors = neighbors.filter(neighbor => !processed.some(node => node.tile.q === neighbor.tile.q && node.tile.r === neighbor.tile.r))


            //assign cost to neighbors and add to search list
            for (let neighbor of neighbors) {

                let inSearch = toSearch.some(node => node.tile.q === neighbor.tile.q && node.tile.r === neighbor.tile.r)

                let costToNeighbor = current.moveCost + this.getTileCost(this.tileData.getEntry(neighbor.tile)) + this.getHeightDifference(current.tile, neighbor.tile)

                if (!inSearch || costToNeighbor < neighbor.g) {
                    neighbor.moveCost = costToNeighbor
                    neighbor.connection = current

                    if (!inSearch && neighbor.moveCost <= moveAmount) {
                        toSearch.push(neighbor)
                    }
                }

            }

        }
        let startIndex = processed.findIndex(node => node.tile.q === start.q && node.tile.r === start.r)
        processed.splice(startIndex, 1)
        return processed.map(tileObj => this.tileData.getEntry(tileObj.tile))
    }

    getAttackSet = (start, range) => {
        return this.tileData.getStarNeighbors(start, range)
    }

    getActionSet = (start) => {
        return this.tileData.getNeighbors(start, 1)
    }

    getPath = (start, target) => {

        let createPath = (startNode, endNode) => {
            let currentPathNode = endNode
            let path = []
            while (!(currentPathNode.tile.q === startNode.tile.q && currentPathNode.tile.r === startNode.tile.r)) {
                path.push(currentPathNode)
                currentPathNode = currentPathNode.connection
            }
            return path.reverse()
        }

        let startNode = this.createNode(start)
        let targetNode = this.createNode(target)

        let toSearch = [startNode]
        let processed = []

        while (toSearch.length > 0) {
            let current = toSearch[0]

            for (let t of toSearch) {
                if (this.GetF(t) < this.GetF(current) || (this.GetF(t) === this.GetF(current) && t.estimateCost < current.h)){
                    current = t
                } 
            }

            processed.push(current)
            let currentToSearchIndex = toSearch.findIndex(node => node.tile.q === current.tile.q && node.tile.r === current.tile.r)
            toSearch.splice(currentToSearchIndex, 1)

            //check if current tile is the target
            if (current.tile.q === targetNode.tile.q && current.tile.r === targetNode.tile.r) {
                return createPath(startNode, current).map(tileObj => tileObj.tile)
            }

            //Get Neighbors
            let neighbors = this.createNeighborNodes(current.tile)
            neighbors = neighbors.filter(neighbor => this.validatePathTile(neighbor.tile) === true)
            neighbors = neighbors.filter(neighbor => !processed.some(node => node.tile.q === neighbor.tile.q && node.tile.r === neighbor.tile.r))


            //assign cost to neighbors and add to search list
            for (let neighbor of neighbors) {

                let inSearch = toSearch.some(node => node.tile.q === neighbor.tile.q && node.tile.r === neighbor.tile.r)
                let tileCost = this.getTileCost(this.tileData.getEntry(neighbor.tile))
                let costToNeighbor = current.moveCost + tileCost + this.getHeightDifference(current.tile, neighbor.tile)

                if (!inSearch || costToNeighbor < neighbor.g) {
                    neighbor.moveCost = costToNeighbor
                    neighbor.connection = current

                    if (!inSearch) {
                        neighbor.estimateCost = this.commonUtils.getDistance(neighbor.tile, targetNode.tile) + tileCost + this.getHeightDifference(neighbor.tile, targetNode.tile)
                        toSearch.push(neighbor)
                    }
                }
            }
        }

        return null
    }

    validatePathTile = (pos) => {
        let terrain = this.structureData.getStructure(pos)
        if(terrain !== null && terrain.spriteType !== 'modifier') return false
        let unit = this.unitData.getUnit(pos)
        if(unit !== null) return false
        return true
    }

    validateAttackTarget = (pos, target, dropAttack) => {

        let validateTargetHeight = (pos, target) => {
            let distance = this.commonUtils.getDistance(pos, target)
            let heightDiff = this.tileData.getEntry(target).height - this.tileData.getEntry(pos).height

            if (heightDiff <= 0 && dropAttack === true) return true

            heightDiff = Math.abs(heightDiff)

            if (heightDiff > distance) return false
            return true
        }

        let validateTileHeight = (tile, percent) => {
            let posHeight = this.tileData.getEntry(pos).height
            let targetHeight = this.tileData.getEntry(target).height
            let projectileHeight = posHeight + (targetHeight - posHeight) * percent + 1
            if (tile.height > projectileHeight) return false
            return true
        }

        let validateTile = (tile, percent) => {
            tile = this.commonUtils.roundToNearestHex(tile)
            tile = this.tileData.getEntry(tile)

            if (tile === null) return true
            if (!validateTileHeight(tile, percent)) return false
            if (this.unitData.getUnit(tile.position) !== null) return false
            if (this.structureData.hasStructure(tile.position) && this.structureData.getStructure(tile.position).spriteType !== 'modifier') return false

            return true
        }

        if (!validateTargetHeight(pos, target)) return false

        let dist = this.commonUtils.getDistance(pos, target)
        let dirVector = { q: target.q - pos.q, r: target.r - pos.r }
        dirVector.q /= dist
        dirVector.r /= dist

        for (let i = 1; i < dist; i++) {
            let tile = { q: pos.q + dirVector.q * i, r: pos.r + dirVector.r * i }
            if (validateTile(tile, i / dist) === false) return false
        }

        return true

    }

}