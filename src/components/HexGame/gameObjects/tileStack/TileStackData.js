import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils";
import TileStackClass from "./TileStack";
import TileGroundShadowClass from './TileGroundShadow'

export default class TileStackDataClass {

    constructor(mapData, selectionData, images) {
        this.mapData = mapData
        this.selectionData = selectionData

        this.images = images

        this.tileMap = new Map();
        this.posMap = new Map();
        this.rotatedMapList = []
        this.maxHeight = null;

        this.utils = new CommonHexMapUtilsClass()
    }

    //Set an entry in the tileMap (void)
    setEntry = (q, r) => {
        this.tileMap.set(q + ',' + r, new TileStackClass({ q: q, r: r }, this.mapData, this.images));
        return this.getEntry(q, r)
    }
    setShadowEntry = (q, r) => {
        this.tileMap.set(q + ',' + r, new TileGroundShadowClass({ q: q, r: r }, this.mapData));
        return this.getEntry(q, r)
    }

    setSelection = (q, r, selection) => {
        if (this.hasTileEntry(q, r)) this.selectionData.setSelection(q, r, selection)
    }

    //delete an entry in the tileMap (void)
    deleteEntry = (q, r) => {
        this.tileMap.delete(q + "," + r);
    }

    setRotatedMapList = () => {

        for (let i = 0; i < 6; i++) {
            //Rotate the hexmap and set the rotatedMap object
            let sortedArr = this.getKeys();

            for (let j = 0; j < sortedArr.length; j++) {
                let rotatedTile = this.utils.rotateTile(sortedArr[j].q, sortedArr[j].r, i)
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
                rotatedMap.set(this.utils.join(sortedArr[j].rotPosQ, sortedArr[j].rotPosR), { q: sortedArr[j].ogPosQ, r: sortedArr[j].ogPosR });
            }

            this.rotatedMapList[i] = rotatedMap
        }
    }

    setMapPos = (drawCanvas) => {

        for (let rotation = 0; rotation < 6; rotation++) {

            //Set map hyp
            let keys = [...this.rotatedMapList[rotation].keys()].map(key => this.utils.split(key))

            let mapWidthMax = Math.max(...keys.map(key => this.mapData.flatTopVecQ.x * key.q + this.mapData.flatTopVecR.x * key.r));
            let mapHeightMax = Math.max(...keys.map(key => this.mapData.flatTopVecQ.y * key.q * this.mapData.squish + this.mapData.flatTopVecR.y * key.r * this.mapData.squish));
            let mapWidthMin = Math.abs(Math.min(...keys.map(key => this.mapData.flatTopVecQ.x * key.q + this.mapData.flatTopVecR.x * key.r)));
            let mapHeightMin = Math.abs(Math.min(...keys.map(key => this.mapData.flatTopVecQ.y * key.q * this.mapData.squish + this.mapData.flatTopVecR.y * key.r * this.mapData.squish)));

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

    getEntry = (q, r) => {
        let entry = this.tileMap.get(q + "," + r)
        if (entry && entry.groundShadowTile == false) return entry
        return null
    }

    getAnyEntry = (q, r) => {
        return this.tileMap.get(q + "," + r)
    }

    getEntryRotated = (q, r, rotation) => {
        let rotatedTile = this.rotatedMapList[rotation].get(this.utils.join(q, r))
        return this.tileMap.get(rotatedTile.q + "," + rotatedTile.r)
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
    getNeighbors = (q, r, rows) => {
        let neighbors = this.getNeighborKeys(q, r, rows)

        return neighbors.map(key => this.getEntry(key.q, key.r))
    }

    //returns keys of all neighbors adjacent to (q, r)
    getNeighborKeys = (q, r, rows) => {

        let validNewNeighbor = (newQ, newR, neighborList, newNeighborList) => {
            if(newQ == q && newR == r) return false
            if(!this.hasTileEntry(newQ, newR)) return false
            if(neighborList.some(neighbor => neighbor.q == newQ && neighbor.r == newR )) return false
            if(newNeighborList.some(neighbor => neighbor.q == newQ && neighbor.r == newR )) return false
            return true
        }

        let neighbors = []

        if (this.hasTileEntry(q, r - 1)) neighbors.push({ q: q, r: r - 1 })
        if (this.hasTileEntry(q + 1, r - 1)) neighbors.push({ q: q + 1, r: r - 1 })
        if (this.hasTileEntry(q + 1, r)) neighbors.push({ q: q + 1, r: r })
        if (this.hasTileEntry(q, r + 1)) neighbors.push({ q: q, r: r + 1 })
        if (this.hasTileEntry(q - 1, r + 1)) neighbors.push({ q: q - 1, r: r + 1  })
        if (this.hasTileEntry(q - 1, r)) neighbors.push({ q: q - 1, r: r })

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
            q1: this.utils.rotateTile(minRminQ - 0.5, minR - 1, rotation).q,
            r1: this.utils.rotateTile(minRminQ - 0.5, minR - 1, rotation).r,

            q2: this.utils.rotateTile(minRmaxQ + 1, minR - 1, rotation).q,
            r2: this.utils.rotateTile(minRmaxQ + 1, minR - 1, rotation).r,

            q3: this.utils.rotateTile(maxRmaxQ + 0.5, maxR + 1, rotation).q,
            r3: this.utils.rotateTile(maxRmaxQ + 0.5, maxR + 1, rotation).r,

            q4: this.utils.rotateTile(maxRminQ - 1, maxR + 1, rotation).q,
            r4: this.utils.rotateTile(maxRminQ - 1, maxR + 1, rotation).r
        }

        let hexVecQ =  { ...this.mapData.flatTopVecQ }
        let hexVecR = { ...this.mapData.flatTopVecR }

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
    hasEntry = (q, r) => {
        return this.tileMap.has(this.utils.join(q, r));
    }
    hasTileEntry = (q, r) => {
        if (!this.hasEntry(q, r)) return false
        let tileObj = this.tileMap.get(this.utils.join(q, r));
        if (tileObj.groundShadowTile == true) return false
        return true
    }

    hexPositionToXYPosition = (keyObj, tileHeight, rotation) => {
        let xOffset;
        let yOffset;

        xOffset = this.mapData.flatTopVecQ.x * keyObj.q + this.mapData.flatTopVecR.x * keyObj.r;
        yOffset = this.mapData.flatTopVecQ.y * keyObj.q * this.mapData.squish + this.mapData.flatTopVecR.y * keyObj.r * this.mapData.squish;


        return {
            x: this.posMap.get(rotation).x + xOffset,
            y: this.posMap.get(rotation).y + yOffset - tileHeight * this.mapData.tileHeight
        }

    }

}