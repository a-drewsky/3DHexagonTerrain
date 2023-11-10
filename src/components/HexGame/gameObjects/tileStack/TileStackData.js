import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils";
import TileStackClass from "./TileStack";

export default class TileStackDataClass {

    constructor(mapData, images) {
        this.mapData = mapData

        this.images = images

        this.tileMap = new Map();
        this.posMap = new Map();
        this.rotatedMapList = []
        this.maxHeight = null;

        this.utils = new CommonHexMapUtilsClass()
    }

    //Set an entry in the tileMap
    setEntry = (pos) => {
        this.tileMap.set(this.utils.join(pos), new TileStackClass(pos, this.mapData, this.images));
        return this.getEntry(pos)
    }
    setShadowEntry = (pos) => {
        this.tileMap.set(this.utils.join(pos), new TileStackClass(pos, this.mapData));
        this.getEntry(pos).groundShadowTile = true
        return this.getEntry(pos)
    }

    //delete an entry in the tileMap
    deleteEntry = (pos) => {
        this.tileMap.delete(this.utils.join(pos));
    }

    setRotatedMapList = () => {

        for (let i = 0; i < 6; i++) {
            //Rotate the hexmap and set the rotatedMap object
            let sortedArr = this.getKeys();

            for (let j = 0; j < sortedArr.length; j++) {
                let rotatedTile = this.utils.rotateTile(sortedArr[j], i)
                sortedArr[j] = {
                    rotPosQ: rotatedTile.q,
                    rotPosR: rotatedTile.r,
                    ogPosQ: sortedArr[j].q,
                    ogPosR: sortedArr[j].r
                };
            }

            sortedArr.sort((a, b) => { return a.rotPosR - b.rotPosR || a.rotPosQ - b.rotPosQ });

            let rotatedMap = new Map();

            for (let j = 0; j < sortedArr.length; j++) {
                rotatedMap.set(this.utils.join({ q: sortedArr[j].rotPosQ, r: sortedArr[j].rotPosR }), { q: sortedArr[j].ogPosQ, r: sortedArr[j].ogPosR });
            }

            this.rotatedMapList[i] = rotatedMap
        }
    }

    setMapPos = (drawCanvas) => {

        for (let rotation = 0; rotation < 6; rotation++) {

            //Set map hyp
            let keys = [...this.rotatedMapList[rotation].keys()].map(key => this.utils.split(key))

            let mapWidthMax = Math.max(...keys.map(key => this.mapData.vecQ.x * key.q + this.mapData.vecR.x * key.r));
            let mapHeightMax = Math.max(...keys.map(key => this.mapData.vecQ.y * key.q * this.mapData.squish + this.mapData.vecR.y * key.r * this.mapData.squish));
            let mapWidthMin = Math.abs(Math.min(...keys.map(key => this.mapData.vecQ.x * key.q + this.mapData.vecR.x * key.r)));
            let mapHeightMin = Math.abs(Math.min(...keys.map(key => this.mapData.vecQ.y * key.q * this.mapData.squish + this.mapData.vecR.y * key.r * this.mapData.squish)));

            let mapWidth = Math.max(mapWidthMax, mapWidthMin)
            let mapHeight = Math.max(mapHeightMax, mapHeightMin)

            let mapHyp = Math.sqrt(mapWidth * mapWidth + mapHeight * mapHeight) - 250; //need a variable for this or something (must be half of value used for hyp in hex map view)


            //Set the hexmap position to the center of the canvas

            let renderHexMapPos = {
                x: 0,
                y: 0
            }

            switch (rotation) {
                case 0:
                    renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 13)
                    renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 3.5)
                    break;
                case 1:
                    renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 22)
                    renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9.5)
                    break;
                case 2:
                    renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 19)
                    renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 15)
                    break;
                case 3:
                    renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 11)
                    renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 20.5)
                    break;
                case 4:
                    renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 2)
                    renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 14.5)
                    break;
                case 5:
                    renderHexMapPos.x = drawCanvas.width / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 5)
                    renderHexMapPos.y = drawCanvas.height / 2 - mapHyp / 2 * Math.cos(Math.PI / 24 * 9)
                    break;
            }


            this.posMap.set(rotation, {
                x: renderHexMapPos.x,
                y: renderHexMapPos.y
            })
        }
    }

    setMaxHeight = () => {
        this.maxHeight = Math.max(...this.getTileMap().map(entry => entry.value.height))
    }

    getEntry = (pos) => {
        let entry = this.tileMap.get(this.utils.join(pos))
        if (entry && entry.groundShadowTile == false) return entry
        return null
    }

    getAnyEntry = (pos) => {
        return this.tileMap.get(this.utils.join(pos))
    }

    getEntryRotated = (pos, rotation) => {
        let rotatedTile = this.rotatedMapList[rotation].get(this.utils.join(pos))
        if(!rotatedTile) return null
        return this.tileMap.get(this.utils.join(rotatedTile))
    }

    //returns the tileMap
    getTileMap = () => {
        let map = Array.from(this.tileMap, ([key, value]) => ({ key, value }));
        let filteredMap = map.filter(entry => entry.value.groundShadowTile == false)
        return filteredMap
    }

    //returns the tileMap
    getFullMap = () => {
        return this.tileMap
    }

    //returns all keys for the tileMap
    getKeys = () => {
        return [...this.tileMap.keys()].map(key => this.utils.split(key))
    }

    //return all key strings (REMOVE)
    getKeyStrings = () => {
        let map = this.getTileMap()
        return map.map(entry => entry.key)
    }

    //returns keys of all neighbors adjacent to (q, r)
    getNeighbors = (pos, rows) => {
        let neighbors = this.getNeighborKeys(pos, rows)

        return neighbors.map(key => this.getEntry(key))
    }

    //returns keys of all neighbors adjacent to (q, r)
    getNeighborKeys = (pos, rows) => {

        let validNewNeighbor = (newQ, newR, neighborList, newNeighborList) => {
            if(newQ == pos.q && newR == pos.r) return false
            if(!this.hasTileEntry({ q: newQ, r: newR })) return false
            if(neighborList.some(neighbor => neighbor.q == newQ && neighbor.r == newR )) return false
            if(newNeighborList.some(neighbor => neighbor.q == newQ && neighbor.r == newR )) return false
            return true
        }

        let neighbors = []

        if (this.hasTileEntry({ q: pos.q, r: pos.r - 1 })) neighbors.push({ q: pos.q, r: pos.r - 1 })
        if (this.hasTileEntry({ q: pos.q + 1, r: pos.r - 1 })) neighbors.push({ q: pos.q + 1, r: pos.r - 1 })
        if (this.hasTileEntry({ q: pos.q + 1, r: pos.r })) neighbors.push({ q: pos.q + 1, r: pos.r })
        if (this.hasTileEntry({ q: pos.q, r: pos.r + 1 })) neighbors.push({ q: pos.q, r: pos.r + 1 })
        if (this.hasTileEntry({ q: pos.q - 1, r: pos.r + 1 })) neighbors.push({ q: pos.q - 1, r: pos.r + 1  })
        if (this.hasTileEntry({ q: pos.q - 1, r: pos.r })) neighbors.push({ q: pos.q - 1, r: pos.r })

        for(let i = 1; i < rows; i++){
            let newNeighbors = []
            for(let tile of neighbors) {
                if (validNewNeighbor(tile.q, tile.r - 1, neighbors, newNeighbors)) newNeighbors.push({ q: tile.q, r: tile.r - 1 })
                if (validNewNeighbor(tile.q + 1, tile.r - 1, neighbors, newNeighbors)) newNeighbors.push({ q: tile.q + 1, r: tile.r - 1 })
                if (validNewNeighbor(tile.q + 1, tile.r, neighbors, newNeighbors)) newNeighbors.push({ q: tile.q + 1, r: tile.r })
                if (validNewNeighbor(tile.q, tile.r + 1, neighbors, newNeighbors)) newNeighbors.push({ q: tile.q, r: tile.r + 1 })
                if (validNewNeighbor(tile.q - 1, tile.r + 1, neighbors, newNeighbors)) newNeighbors.push({ q: tile.q - 1, r: tile.r + 1 })
                if (validNewNeighbor(tile.q - 1, tile.r, neighbors, newNeighbors)) newNeighbors.push({ q: tile.q - 1, r: tile.r })
            }
            neighbors = neighbors.concat(newNeighbors)
        }

        return neighbors
    }

    getTablePosition = (rotation) => {

        let keys = this.getKeys();

        let minR = Math.min(...keys.map(key => key.r));
        let maxR = Math.max(...keys.map(key => key.r));
        let minRminQ = Math.min(...keys.filter(key => key.r == minR).map(key => key.q));
        let minRmaxQ = Math.max(...keys.filter(key => key.r == minR).map(key => key.q));
        let maxRminQ = Math.min(...keys.filter(key => key.r == maxR).map(key => key.q));
        let maxRmaxQ = Math.max(...keys.filter(key => key.r == maxR).map(key => key.q));

        let tableDims = {
            q1: this.utils.rotateTile({ q: minRminQ - 0.5, r: minR - 1, rotation }).q,
            r1: this.utils.rotateTile({ q: minRminQ - 0.5, r: minR - 1, rotation }).r,

            q2: this.utils.rotateTile({ q: minRmaxQ + 1, r: minR - 1, rotation }).q,
            r2: this.utils.rotateTile({ q: minRmaxQ + 1, r: minR - 1, rotation }).r,

            q3: this.utils.rotateTile({ q: maxRmaxQ + 0.5, r: maxR + 1, rotation }).q,
            r3: this.utils.rotateTile({ q: maxRmaxQ + 0.5, r: maxR + 1, rotation }).r,

            q4: this.utils.rotateTile({ q: maxRminQ - 1, r: maxR + 1, rotation }).q,
            r4: this.utils.rotateTile({ q: maxRminQ - 1, r: maxR + 1, rotation }).r
        }

        let hexVecQ =  { ...this.mapData.vecQ }
        let hexVecR = { ...this.mapData.vecR }

        let tablePosition = [
            {
                x: this.posMap.get(rotation).x + hexVecQ.x * tableDims.q1 + hexVecR.x * tableDims.r1,
                y: this.posMap.get(rotation).y + hexVecQ.y * tableDims.q1 * this.mapData.squish + hexVecR.y * tableDims.r1 * this.mapData.squish
            },

            {
                x: this.posMap.get(rotation).x + hexVecQ.x * tableDims.q2 + hexVecR.x * tableDims.r2,
                y: this.posMap.get(rotation).y + hexVecQ.y * tableDims.q2 * this.mapData.squish + hexVecR.y * tableDims.r2 * this.mapData.squish
            },

            {
                x: this.posMap.get(rotation).x + hexVecQ.x * tableDims.q3 + hexVecR.x * tableDims.r3,
                y: this.posMap.get(rotation).y + hexVecQ.y * tableDims.q3 * this.mapData.squish + hexVecR.y * tableDims.r3 * this.mapData.squish
            },

            {
                x: this.posMap.get(rotation).x + hexVecQ.x * tableDims.q4 + hexVecR.x * tableDims.r4,
                y: this.posMap.get(rotation).y + hexVecQ.y * tableDims.q4 * this.mapData.squish + hexVecR.y * tableDims.r4 * this.mapData.squish
            }
        ]

        return [...tablePosition];
    }


    //check if hexmap has an entry (returns a boolean)
    hasEntry = (pos) => {
        return this.tileMap.has(this.utils.join(pos));
    }
    hasTileEntry = (pos) => {
        if (!this.hasEntry(pos)) return false
        let tileObj = this.getEntry(pos)
        if (!tileObj) return false
        return true
    }

    hexPositionToXYPosition = (keyObj, tileHeight, rotation) => {
        let xOffset;
        let yOffset;

        xOffset = this.mapData.vecQ.x * keyObj.q + this.mapData.vecR.x * keyObj.r;
        yOffset = this.mapData.vecQ.y * keyObj.q * this.mapData.squish + this.mapData.vecR.y * keyObj.r * this.mapData.squish;


        return {
            x: this.posMap.get(rotation).x + xOffset,
            y: this.posMap.get(rotation).y + yOffset - tileHeight * this.mapData.tileHeight
        }

    }

}