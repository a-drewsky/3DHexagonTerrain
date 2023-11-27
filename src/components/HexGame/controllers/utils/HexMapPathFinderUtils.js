import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"

export default class HexMapPathFinderUtilsClass {

    constructor(hexMapData) {

        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData
        this.unitData = hexMapData.unitData
        this.structureData = hexMapData.structureData

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

    isValidPathTile = (pos) => {
        let terrain = this.structureData.getStructure(pos)
        if(terrain !== null && terrain.spriteType !== 'modifier') return false
        let unit = this.unitData.getUnit(pos)
        if(unit !== null) return false
        return true
    }

    getTileCost = (tile) => {
        if(this.tileData.getEntry(tile).biome === 'water') return 2
        let terrain = this.structureData.getStructure(tile)
        if(terrain && terrain.cost) return terrain.cost
        return 0
    }

    getPath = (startNode, endNode) => {
        let currentPathNode = endNode
        let path = []
        while (!(currentPathNode.tile.q === startNode.tile.q && currentPathNode.tile.r === startNode.tile.r)) {
            path.push(currentPathNode)
            currentPathNode = currentPathNode.connection
        }
        return path.reverse()
    }

    pathCost = (path) => {

        let cost = 0
        for(let index in path){
            if(index === '0') continue
            let tile = path[index]
            let tileCost = this.getTileCost(tile)

            cost += tileCost + this.getHeightDifference(path[index-1], path[index]) + 1
        }

        return cost

    }

    findMoveSet = (start, moveAmount) => {
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
            neighbors = neighbors.filter(neighbor => this.isValidPathTile(neighbor.tile) === true)
            neighbors = neighbors.filter(neighbor => !processed.some(node => node.tile.q === neighbor.tile.q && node.tile.r === neighbor.tile.r))


            //assign cost to neighbors and add to search list
            for (let neighbor of neighbors) {

                let inSearch = toSearch.some(node => node.tile.q === neighbor.tile.q && node.tile.r === neighbor.tile.r)

                let tileCost = this.getTileCost(neighbor.tile)

                let costToNeighbor = current.moveCost + tileCost + this.getHeightDifference(current.tile, neighbor.tile) + 1

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
        return processed
    }

    findAttackMoveSet = (start, range) => {
        return this.tileData.getNeighbors(start, range)
    }

    findActionMoveSet = (start) => {
        return this.tileData.getNeighbors(start, 1)
    }

    findFullMoveSet = (moveSet, unitPos) => {

        let newMoveSet = [...moveSet]
        
        //path neighbors
        for(let node of moveSet){
            let tile = node.tile

            let neighbors = this.createNeighborNodes(tile)

            for(let neighborNode of neighbors){
                if(neighborNode.tile.q === unitPos.q && neighborNode.tile.r === unitPos.r) continue
                if(newMoveSet.findIndex(moveSetNode => moveSetNode.tile.q === neighborNode.tile.q && moveSetNode.tile.r === neighborNode.tile.r) !== -1) continue
                newMoveSet.push(neighborNode)
            }
        }

        //unit neighbors
        let neighbors = this.createNeighborNodes(unitPos)

        for(let neighborNode of neighbors){
            if(neighborNode.tile.q === unitPos.q && neighborNode.tile.r === unitPos.r) continue
            if(newMoveSet.findIndex(moveSetNode => moveSetNode.tile.q === neighborNode.tile.q && moveSetNode.tile.r === neighborNode.tile.r) !== -1) continue
            newMoveSet.push(neighborNode)
        }

        return newMoveSet

    }

    findPath = (start, target) => {
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
                return this.getPath(startNode, current)
            }

            //Get Neighbors
            let neighbors = this.createNeighborNodes(current.tile)
            neighbors = neighbors.filter(neighbor => this.isValidPathTile(neighbor.tile) === true)
            neighbors = neighbors.filter(neighbor => !processed.some(node => node.tile.q === neighbor.tile.q && node.tile.r === neighbor.tile.r))


            //assign cost to neighbors and add to search list
            for (let neighbor of neighbors) {

                let inSearch = toSearch.some(node => node.tile.q === neighbor.tile.q && node.tile.r === neighbor.tile.r)

                let tileCost = this.getTileCost(neighbor.tile)

                let costToNeighbor = current.moveCost + tileCost + this.getHeightDifference(current.tile, neighbor.tile) + 1

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

}