export default class HexMapPathFinderClass {

    constructor(hexMapData, camera) {

        this.hexMapData = hexMapData
        this.camera = camera

    }

    createNode = (q, r) => {
        return {
            tile: {
                q: q,
                r: r
            },
            connection: null,
            moveCost: null,
            estimateCost: null
        }
    }

    GetF = (node) => {
        return node.moveCost + node.estimateCost
    }

    createNeighborNodes = (q, r) => {
        let neighbors = this.hexMapData.getNeighborKeys(q, r)

        return neighbors.map(neighbor => this.createNode(neighbor.q, neighbor.r))
    }

    getDistance = (a, b) => {
        return (Math.abs(a.q - b.q) 
                + Math.abs(a.q + a.r - b.q - b.r)
                + Math.abs(a.r - b.r)) / 2
    }

    getHeightDifference = (a, b) => {
        return Math.abs(this.hexMapData.getEntry(a.q, a.r).height - this.hexMapData.getEntry(b.q, b.r).height)
    }

    isValid = (q, r) => {
        let terrain = this.hexMapData.getTerrain(q, r)
        if(terrain != null && terrain.type == 'structures') return false
        let unit = this.hexMapData.getUnit(q, r)
        if(unit != null) return false
        return true
    }

    getTileCost = (tile) => {
        if(this.hexMapData.getEntry(tile.q, tile.r).biome == 'water') return 2
        let terrain = this.hexMapData.getTerrain(tile.q, tile.r)
        if(terrain != null && terrain.name == 'Forest') return 1
        return 0
    }

    getPath = (startNode, endNode) => {
        let currentPathNode = endNode
        let path = []
        while (!(currentPathNode.tile.q == startNode.tile.q && currentPathNode.tile.r == startNode.tile.r)) {
            path.push(currentPathNode)
            currentPathNode = currentPathNode.connection
        }
        return path.reverse()
    }

    findMoveSet = (start, moveAmount) => {
        let startNode = this.createNode(start.q, start.r)

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
            let currentToSearchIndex = toSearch.findIndex(node => node.tile.q == current.tile.q && node.tile.r == current.tile.r)
            toSearch.splice(currentToSearchIndex, 1)

            //Get Neighbors
            let neighbors = this.createNeighborNodes(current.tile.q, current.tile.r)
            neighbors = neighbors.filter(neighbor => this.isValid(neighbor.tile.q, neighbor.tile.r) == true)
            neighbors = neighbors.filter(neighbor => !processed.some(node => node.tile.q == neighbor.tile.q && node.tile.r == neighbor.tile.r))


            //assign cost to neighbors and add to search list
            for (let neighbor of neighbors) {

                let inSearch = toSearch.some(node => node.tile.q == neighbor.tile.q && node.tile.r == neighbor.tile.r)

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
        let startIndex = processed.findIndex(node => node.tile.q == start.q && node.tile.r == start.r)
        processed.splice(startIndex, 1)
        return processed
    }

    findPath = (start, target) => {
        let startNode = this.createNode(start.q, start.r)
        let targetNode = this.createNode(target.q, target.r)

        let toSearch = [startNode]
        let processed = []

        while (toSearch.length > 0) {
            let current = toSearch[0]

            for (let t of toSearch) {
                if (this.GetF(t) < this.GetF(current) || this.GetF(t) == this.GetF(current) && t.estimateCost < current.h){
                    current = t
                } 
            }

            processed.push(current)
            let currentToSearchIndex = toSearch.findIndex(node => node.tile.q == current.tile.q && node.tile.r == current.tile.r)
            toSearch.splice(currentToSearchIndex, 1)

            //check if current tile is the target
            if (current.tile.q == targetNode.tile.q && current.tile.r == targetNode.tile.r) {
                return this.getPath(startNode, current)
            }

            //Get Neighbors
            let neighbors = this.createNeighborNodes(current.tile.q, current.tile.r)
            neighbors = neighbors.filter(neighbor => this.isValid(neighbor.tile.q, neighbor.tile.r) == true)
            neighbors = neighbors.filter(neighbor => !processed.some(node => node.tile.q == neighbor.tile.q && node.tile.r == neighbor.tile.r))


            //assign cost to neighbors and add to search list
            for (let neighbor of neighbors) {

                let inSearch = toSearch.some(node => node.tile.q == neighbor.tile.q && node.tile.r == neighbor.tile.r)

                let tileCost = this.getTileCost(neighbor.tile)

                let costToNeighbor = current.moveCost + tileCost + this.getHeightDifference(current.tile, neighbor.tile) + 1

                if (!inSearch || costToNeighbor < neighbor.g) {
                    neighbor.moveCost = costToNeighbor
                    neighbor.connection = current

                    if (!inSearch) {
                        neighbor.estimateCost = this.getDistance(neighbor.tile, targetNode.tile) + tileCost + this.getHeightDifference(neighbor.tile, targetNode.tile)
                        toSearch.push(neighbor)
                    }
                }

            }

        }

        return null
    }

}