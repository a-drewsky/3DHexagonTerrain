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
            moveCost: 0,
            g: null,
            h: null
        }
    }

    GetF = (node) => {
        return node.g + node.h
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

    findPath = (start, target) => {
        let startNode = this.createNode(start.q, start.r)
        let targetNode = this.createNode(target.q, target.r)

        let toSearch = [startNode]
        let processed = []

        while (toSearch.length > 0) {
            let current = toSearch[0]

            for (let t of toSearch) {
                if (this.GetF(t) < this.GetF(current) || this.GetF(t) == this.GetF(current) && t.h < current.h){
                    current = t
                } 
            }

            console.log(current.tile)

            processed.push(current)
            let currentToSearchIndex = toSearch.findIndex(node => node.tile.q == current.tile.q && node.tile.r == current.tile.r)
            toSearch.splice(currentToSearchIndex, 1)

            //check if current tile is the target
            if (current.tile.q == targetNode.tile.q && current.tile.r == targetNode.tile.r) {
                let currentPathNode = current
                let path = []
                while (!(currentPathNode.tile.q == startNode.tile.q && currentPathNode.tile.r == startNode.tile.r)) {
                    path.push({tile: currentPathNode.tile, gCost: currentPathNode.g, hCost: currentPathNode.h})
                    currentPathNode = currentPathNode.connection
                }
                return path.reverse()
            }

            //Get Neighbors
            let neighbors = this.createNeighborNodes(current.tile.q, current.tile.r)
            neighbors = neighbors.filter(neighbor => this.hexMapData.getEntry(neighbor.tile.q, neighbor.tile.r).biome != 'water')
            neighbors = neighbors.filter(neighbor => !processed.some(node => node.tile.q == neighbor.tile.q && node.tile.r == neighbor.tile.r))


            //assign cost to neighbors and add to search list
            for (let neighbor of neighbors) {

                let inSearch = toSearch.some(node => node.tile.q == neighbor.tile.q && node.tile.r == neighbor.tile.r)

                //get height difference

                let costToNeighbor = current.g + this.getHeightDifference(current.tile, neighbor.tile) + 1

                if (!inSearch || costToNeighbor < neighbor.g) {
                    neighbor.g = costToNeighbor
                    neighbor.connection = current

                    if (!inSearch) {
                        neighbor.h = this.getDistance(neighbor.tile, targetNode.tile) + this.getHeightDifference(neighbor.tile, targetNode.tile)
                        toSearch.push(neighbor)
                    }
                }

            }

        }

        return null
    }

}