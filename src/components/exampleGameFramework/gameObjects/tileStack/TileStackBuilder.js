import NoiseClass from "../../utilities/perlin";
import CommonBuilderUtilsClass from "../commonUtils/CommonBuilderUtils";
import CommonHexMapUtilsClass from "../commonUtils/CommonHexMapUtils";

import { MAX_ELEVATION, SAND_HILL_ELVATION_DIVISOR, ELEVATION_MULTIPLIER, TEMP_RANGES, WATER_TEMP_RANGES, LOW_TERRAIN_GENERATION_RANGES, MIRROR_MAP } from './TileStackConstants'

import { BIOME_CONSTANTS, SEED_MULTIPLIER, CELL_SIZE, MAP_SIZES } from '../commonConstants/CommonConstants'

export default class TileStackBuilderClass {

    constructor(hexMapData) {

        this.mapData = hexMapData.mapData
        this.tileData = hexMapData.tileData

        this.utils = new CommonBuilderUtilsClass(hexMapData)
        this.commonUtils = new CommonHexMapUtilsClass()
        this.noise = new NoiseClass()

    }

    buildMap = (mapSize) => {
        this.generateMap(mapSize)
        this.generateBiomes(mapSize)
        this.smoothBiomes()
    }

    generateMap = (mapSize) => {

        let mapConfig = MAP_SIZES[mapSize]
        let Qgen = mapConfig.q * CELL_SIZE.q
        let Rgen = mapConfig.r * CELL_SIZE.r + mapConfig.bufferSize * 2

        let groundShadowDistance = 3 //make setting

        if (MIRROR_MAP) {
            for (let r = 0; r < Math.ceil(Rgen / 2); r++) {
                for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
                    this.tileData.setEntry(q, r);
                }
            }
        } else {
            for (let r = -groundShadowDistance; r < 0; r++) {
                for (let q = -1 * Math.floor(r / 2) - groundShadowDistance; q < Qgen - Math.floor(r / 2) + groundShadowDistance; q++) {
                    this.tileData.setShadowEntry(q, r);
                }
            }
            for (let r = 0; r < Rgen; r++) {
                for (let q = -1 * Math.floor(r / 2) - groundShadowDistance; q < -1 * Math.floor(r / 2); q++) {
                    this.tileData.setShadowEntry(q, r);
                }
                for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
                    this.tileData.setEntry(q, r);
                }
                for (let q = Qgen - Math.floor(r / 2); q < Qgen - Math.floor(r / 2) + groundShadowDistance; q++) {
                    this.tileData.setShadowEntry(q, r);
                }
            }
            for (let r = Rgen; r < Rgen + groundShadowDistance; r++) {
                for (let q = -1 * Math.floor(r / 2) - groundShadowDistance; q < Qgen - Math.floor(r / 2) + groundShadowDistance; q++) {
                    this.tileData.setShadowEntry(q, r);
                }
            }
        }

    }

    generateBiomes = (mapSize) => {

        let noiseFluctuation = MAP_SIZES[mapSize].noiseFluctuation

        //set generation seeds
        let elevationSeed1 = Math.random() * SEED_MULTIPLIER
        let elevationSeed2 = Math.random() * SEED_MULTIPLIER
        let tempSeed1 = Math.random() * SEED_MULTIPLIER
        let tempSeed2 = Math.random() * SEED_MULTIPLIER

        for (let entry of this.tileData.getTileMap()) {

            let keyObj = this.commonUtils.split(entry.key);

            //elevation generation
            let tileHeightNoise = this.noise.noise([elevationSeed1 + keyObj.q / noiseFluctuation, elevationSeed1 + keyObj.r / noiseFluctuation]) * this.noise.noise([elevationSeed2 + keyObj.q / noiseFluctuation, elevationSeed2 + keyObj.r / noiseFluctuation])

            let tileHeight = Math.ceil(tileHeightNoise * ELEVATION_MULTIPLIER)

            let heightSet = false;
            for (let i in LOW_TERRAIN_GENERATION_RANGES) {
                if (tileHeight <= LOW_TERRAIN_GENERATION_RANGES[i]) {
                    tileHeight = parseInt(i);
                    heightSet = true;
                    break;
                }
            }
            if (!heightSet) tileHeight -= LOW_TERRAIN_GENERATION_RANGES[4] - 4;

            tileHeight = Math.min(tileHeight, MAX_ELEVATION)


            //temp generation
            let tileTemp = this.noise.noise([tempSeed1 + keyObj.q / noiseFluctuation, tempSeed1 + keyObj.r / noiseFluctuation]) * this.noise.noise([tempSeed2 + keyObj.q / noiseFluctuation, tempSeed2 + keyObj.r / noiseFluctuation])

            this.generteTileBiomes(this.tileData.getEntry(keyObj.q, keyObj.r), tileHeight, tileTemp)

        }

        this.tileData.setMaxHeight();
    }

    generteTileBiomes = (tileObj, tileHeight, tileTemp) => {

        //set biome
        let tileBiome = null
        let tileVerylowBiome = null
        let tileLowBiome = null
        let tileMidBiome = null
        let tileHighBiome = null
        let tileVeryhighBiome = null

        let biome = null

        biome = 'water'
        if (tileTemp < WATER_TEMP_RANGES['frozenwater']) biome = 'frozenwater'
        if (tileTemp > WATER_TEMP_RANGES['water']) biome = 'playa'
        tileVerylowBiome = biome

        for (let range in TEMP_RANGES) {
            if (tileTemp < TEMP_RANGES[range]) {
                biome = range
                break;
            }
        }
        tileLowBiome = biome
        if (tileHeight >= this.mapData.elevationRanges['low']) tileVerylowBiome = biome

        biome = 'snowhill'
        if (tileTemp > TEMP_RANGES['tundra']) biome = 'grasshill'
        if (tileTemp > TEMP_RANGES['woodlands']) biome = 'savannahill'
        if (tileTemp > TEMP_RANGES['savanna']) {
            biome = 'sandhill'
            if (tileHeight >= this.mapData.elevationRanges['mid']) tileHeight = tileHeight - Math.ceil((tileHeight - this.mapData.elevationRanges['mid']) / SAND_HILL_ELVATION_DIVISOR) //set sand hill elevation
        }
        tileMidBiome = biome

        biome = 'rockmountain'
        if (tileTemp < TEMP_RANGES['tundra']) biome = 'snowmountain'
        if (tileTemp > TEMP_RANGES['savanna']) biome = 'sandhill'
        tileHighBiome = biome

        biome = 'snowmountain'
        if (tileTemp > TEMP_RANGES['savanna']) biome = 'sandhill'
        tileVeryhighBiome = biome


        if (tileHeight >= this.mapData.elevationRanges['verylow']) tileBiome = tileVerylowBiome
        if (tileHeight >= this.mapData.elevationRanges['low']) tileBiome = tileLowBiome
        if (tileHeight >= this.mapData.elevationRanges['mid']) tileBiome = tileMidBiome
        if (tileHeight >= this.mapData.elevationRanges['high']) tileBiome = tileHighBiome
        if (tileHeight >= this.mapData.elevationRanges['veryhigh']) tileBiome = tileVeryhighBiome


        tileObj.height = tileHeight
        tileObj.biome = tileBiome
        tileObj.verylowBiome = tileVerylowBiome
        tileObj.lowBiome = tileLowBiome
        tileObj.midBiome = tileMidBiome
        tileObj.highBiome = tileHighBiome
        tileObj.veryhighBiome = tileVeryhighBiome

    }

    smoothBiomes = () => {
        let keyStrings = this.tileData.getKeyStrings();

        let getBiomeSet = (keyString, keyStrSet) => {

            keyStrSet.add(keyString)

            //get tile biome
            let keyObj = this.commonUtils.split(keyString);
            let tileBiome = this.tileData.getEntry(keyObj.q, keyObj.r).biome

            let neighborKeys = this.tileData.getNeighborKeys(keyObj.q, keyObj.r)
            neighborKeys = neighborKeys.filter(neighborKey => this.tileData.getEntry(neighborKey.q, neighborKey.r).biome == tileBiome || BIOME_CONSTANTS[tileBiome].biomeGroup.includes(this.tileData.getEntry(neighborKey.q, neighborKey.r).biome))
            neighborKeys = neighborKeys.filter(neighborKey => !keyStrSet.has(this.commonUtils.join(neighborKey.q, neighborKey.r)))


            if (neighborKeys.length == 0) return keyStrSet

            for (let i = 0; i < neighborKeys.length; i++) {
                //recursion
                let keyStr = this.commonUtils.join(neighborKeys[i].q, neighborKeys[i].r)
                keyStrSet = getBiomeSet(keyStr, keyStrSet)
            }

            return keyStrSet

        }

        let smoothTile = (keyString) => {
            let keyObj = this.commonUtils.split(keyString);
            let tileBiome = this.tileData.getEntry(keyObj.q, keyObj.r).biome


            //check if tile has non-similar biome neighbors
            let neighborKeys = this.tileData.getNeighborKeys(keyObj.q, keyObj.r)
            neighborKeys = neighborKeys.filter(neighborKey => this.tileData.getEntry(neighborKey.q, neighborKey.r).biome != tileBiome)
            if (neighborKeys.length == 0) return false

            //get array of neighbor biomes
            let biomeArr = neighborKeys.map(neighborKey => this.tileData.getEntry(neighborKey.q, neighborKey.r).biome)

            //find the most common neighbor biome
            let modeMap = {};
            let maxBiome = biomeArr[0]
            if (biomeArr.length > 1) {
                let maxCount = 1;
                for (let i = 0; i < biomeArr.length; i++) {
                    let biome = biomeArr[i];
                    if (modeMap[biome] == null) modeMap[biome] = 1;
                    else modeMap[biome]++;

                    if (modeMap[biome] > maxCount) {
                        maxBiome = biome;
                        maxCount = modeMap[biome];
                    }
                }
            }

            //clone a tile with most common biome
            neighborKeys = neighborKeys.filter(neighborKey => this.tileData.getEntry(neighborKey.q, neighborKey.r).biome == maxBiome)
            let neighborKeyToClone = neighborKeys[Math.floor(Math.random() * neighborKeys.length)]
            let tileToClone = this.tileData.getEntry(neighborKeyToClone.q, neighborKeyToClone.r)
            this.utils.cloneTile(tileToClone, keyObj)

            return true
        }

        while (keyStrings.length > 0) {

            //get biome
            let keyObj = this.commonUtils.split(keyStrings[0])
            let biome = this.tileData.getEntry(keyObj.q, keyObj.r).biome

            //get tile set
            let keyStrSet = new Set()
            keyStrSet = getBiomeSet(keyStrings[0], keyStrSet);
            let keyStrArr = Array.from(keyStrSet)

            //remove set from keyStrings
            for (let i = 0; i < keyStrArr.length; i++) {
                let keyStrArrObj = this.commonUtils.split(keyStrArr[i])
                let keyStrArrObjBiome = this.tileData.getEntry(keyStrArrObj.q, keyStrArrObj.r).biome

                if (keyStrArrObjBiome == biome) {
                    let keyIndex = keyStrings.indexOf(keyStrArr[i]);
                    if (keyIndex != -1) keyStrings.splice(keyIndex, 1);
                }
            }

            //Check size of biome set and fix tiles if neccessary
            console.log(biome)
            if (keyStrArr.length < BIOME_CONSTANTS[biome].minBiomeSmoothing) {
                while (keyStrArr.length > 0) {
                    let keyStrArrObj = this.commonUtils.split(keyStrArr[0])
                    let keyStrArrObjBiome = this.tileData.getEntry(keyStrArrObj.q, keyStrArrObj.r).biome


                    if (keyStrArrObjBiome != biome) keyStrArr.shift()
                    else if (smoothTile(keyStrArr[0])) keyStrArr.shift()
                    else {
                        keyStrArr.push(keyStrArr.shift());
                    }
                }
            }

        }

    }

    reduceTileHeights = () => {
        let reduced = true

        while (reduced == true) {
            reduced = false
            for (let entry of this.tileData.getTileMap()) {

                let keyObj = this.commonUtils.split(entry.key);
                let tile = this.tileData.getEntry(keyObj.q, keyObj.r)
                let neighborKeys = this.tileData.getNeighborKeys(keyObj.q, keyObj.r)

                let isCliff = false

                for (let neighborKey of neighborKeys) {
                    let neighborTile = this.tileData.getEntry(neighborKey.q, neighborKey.r)

                    if (tile.height - neighborTile.height > 2) {
                        isCliff = true
                        break
                    }
                }

                if (isCliff == false) continue

                let hasStep = false

                while (hasStep == false) {

                    for (let neighborKey of neighborKeys) {
                        let neighborTile = this.tileData.getEntry(neighborKey.q, neighborKey.r)

                        if (tile.height - neighborTile.height > 0 && tile.height - neighborTile.height < 3) {
                            hasStep = true
                            break
                        }
                    }
                    if (hasStep == false) {
                        tile.height--
                        reduced = true
                    }
                }

                this.utils.setTileBiome(tile)

            }
        }

    }

}