import noise from "../../../utilities/perlin";
import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils";
import StructureBuilderUtilsClass from "./StructureBuilderUtils";

import { SECOND_MINE_CHANCE, THIRD_MINE_CHACE } from './StructureConstants'

import { BIOME_CONSTANTS, SEED_MULTIPLIER, CELL_SIZE, MAP_SIZES } from '../../commonConstants/CommonConstants'

export default class StructureBuilderClass {

   constructor(hexMapData, tileData, structureData) {
      this.hexMapData = hexMapData;
      this.tileData = tileData
      this.structureData = structureData

      this.structureBuilderUtils = new StructureBuilderUtilsClass(hexMapData, tileData, structureData)
      this.commonUtils = new CommonHexMapUtilsClass()

   }

   generateStructures = (mapSizeConstant) => {
      let noiseFluctuation = MAP_SIZES[mapSizeConstant.size].noiseFluctuation
      this.generateModifiers(noiseFluctuation)
      this.generateProps()
      this.generateMainBases(mapSizeConstant.q, mapSizeConstant.r, mapSizeConstant.size)
      this.generateMines(mapSizeConstant.q, mapSizeConstant.r, mapSizeConstant.size)
      this.generateBases(mapSizeConstant.q, mapSizeConstant.r, mapSizeConstant.size)
   }

   generateBases = (q, r, mapSize) => {

      let bufferSize = MAP_SIZES[mapSize].bufferSize

      for (let rGen = 0; rGen < r; rGen++) {
         for (let qGen = 0; qGen < q; qGen++) {
            let cellTiles = []

            for (let rPos = bufferSize + CELL_SIZE.r * rGen; rPos < bufferSize + CELL_SIZE.r * (rGen + 1); rPos++) {
               for (let qPos = -1 * Math.floor(rPos / 2) + CELL_SIZE.q * qGen; qPos < CELL_SIZE.q * (qGen + 1) - Math.floor(rPos / 2); qPos++) {
                  cellTiles.push({
                     q: qPos,
                     r: rPos
                  })
               }
            }

            let selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
            let selectedTilePos = cellTiles[selectedTileIndex]
            cellTiles.splice(selectedTileIndex, 1)
            let selectedTile = this.tileData.getEntry(selectedTilePos.q, selectedTilePos.r)


            while (!this.structureBuilderUtils.isValidStructureTile(selectedTilePos.q, selectedTilePos.r, selectedTile)) {
               if (cellTiles.length == 0) break;
               selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
               selectedTilePos = cellTiles[selectedTileIndex]
               cellTiles.splice(selectedTileIndex, 1)
               selectedTile = this.tileData.getEntry(selectedTilePos.q, selectedTilePos.r)
            }

            if (cellTiles.length == 0) break;

            //flatten tiles
            let flatList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

            let terrainHeight = this.structureBuilderUtils.getAverageHeight(selectedTilePos.q, selectedTilePos.r, flatList)

            this.structureBuilderUtils.flattenTerrain(selectedTilePos.q, selectedTilePos.r, flatList, terrainHeight)

            this.structureData.setBunker(selectedTilePos.q, selectedTilePos.r, 'bunker')

         }
      }

   }

   generateMainBases = (q, r, mapSize) => {
      let bufferSize = MAP_SIZES[mapSize].bufferSize

      //base 1
      let rPos = Math.floor(bufferSize + CELL_SIZE.r * 0.25)
      let qPos = Math.floor(CELL_SIZE.q * 0.75 - Math.floor(0.25 / 2))

      this.structureBuilderUtils.setMainBase(qPos, rPos)

      //base 2
      rPos = Math.floor(bufferSize + CELL_SIZE.r * r - CELL_SIZE.r * 0.25)
      qPos = Math.floor(CELL_SIZE.q * 1 - Math.floor(rPos / 2))

      this.structureBuilderUtils.setMainBase(qPos, rPos)
   }

   generateMines = (q, r, mapSize) => {

      let bufferSize = MAP_SIZES[mapSize].bufferSize

      let closeSpriteList = ['goldmine', 'coppermine']

      let farSpriteList = ['goldmine', 'ironmine', 'rubymine', 'amethystmine']

      for (let rGen = 0; rGen < r; rGen++) {
         for (let qGen = 0; qGen < q; qGen++) {
            let cellTiles = []

            for (let rPos = bufferSize + CELL_SIZE.r * rGen; rPos < bufferSize + CELL_SIZE.r * (rGen + 1); rPos++) {
               for (let qPos = -1 * Math.floor(rPos / 2) + CELL_SIZE.q * qGen; qPos < CELL_SIZE.q * (qGen + 1) - Math.floor(rPos / 2); qPos++) {
                  cellTiles.push({
                     q: qPos,
                     r: rPos
                  })
               }
            }

            let mineCount = 1;

            if (Math.random() < SECOND_MINE_CHANCE) mineCount++
            if (Math.random() < THIRD_MINE_CHACE) mineCount++

            for (let i = 0; i < mineCount; i++) {
               let selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
               let selectedTilePos = cellTiles[selectedTileIndex]
               cellTiles.splice(selectedTileIndex, 1)
               let selectedTile = this.tileData.getEntry(selectedTilePos.q, selectedTilePos.r)


               while (!this.structureBuilderUtils.isValidStructureTile(selectedTilePos.q, selectedTilePos.r, selectedTile)) {
                  if (cellTiles.length == 0) break;
                  selectedTileIndex = Math.floor(Math.random() * cellTiles.length)
                  selectedTilePos = cellTiles[selectedTileIndex]
                  cellTiles.splice(selectedTileIndex, 1)
                  selectedTile = this.tileData.getEntry(selectedTilePos.q, selectedTilePos.r)
               }

               if (cellTiles.length == 0) break;

               //flatten tiles
               let flatList = [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }]

               let terrainHeight = this.structureBuilderUtils.getAverageHeight(selectedTilePos.q, selectedTilePos.r, flatList)

               this.structureBuilderUtils.flattenTerrain(selectedTilePos.q, selectedTilePos.r, flatList, terrainHeight)

               let closeSection = false

               if (rGen == 0 || rGen == r - 1) closeSection = true


               let mineType

               if (closeSection) mineType = closeSpriteList[Math.floor(Math.random() * closeSpriteList.length)]
               else mineType = farSpriteList[Math.floor(Math.random() * farSpriteList.length)]

               this.structureData.setResource(selectedTilePos.q, selectedTilePos.r, mineType)
            }

         }
      }

   }

   generateProps = () => {

      let thresholds = {
         savannaTree: 0.95,
         largeRock: 0.9
      }

      for (let entry of this.tileData.getTileMap()) {
         let keyObj = this.commonUtils.split(entry.key);

         let spawnChance = {
            savannaTree: Math.random(),
            largeRock: Math.random()
         }

         //generate savanna trees
         if ((entry.value.biome == 'savanna' || entry.value.biome == 'savannahill') && spawnChance.savannaTree > thresholds.savannaTree && !this.structureBuilderUtils.maxNeighbors(keyObj.q, keyObj.r, entry.value.biome)) {
            this.structureData.setProp(keyObj.q, keyObj.r, 'savannaTree')
         }

         //generate large rocks
         let terrain = this.structureData.getStructure(keyObj.q, keyObj.r)
         if (terrain != null && terrain.name == 'Rocks' && spawnChance.largeRock > thresholds.largeRock) {
            this.structureData.setProp(keyObj.q, keyObj.r, 'largeRock')
         }

      }
   }

   generateModifiers = (noiseFluctuation) => {

      let treeSeeds = {
         woodlands1: Math.random() * SEED_MULTIPLIER,
         woodlands2: Math.random() * SEED_MULTIPLIER,
         tundra1: Math.random() * SEED_MULTIPLIER,
         tundra2: Math.random() * SEED_MULTIPLIER,
         desert1: Math.random() * SEED_MULTIPLIER,
         desert2: Math.random() * SEED_MULTIPLIER
      }

      let rockSeeds = [Math.random() * SEED_MULTIPLIER, Math.random() * SEED_MULTIPLIER]

      for (let entry of this.tileData.getTileMap()) {
         let keyObj = this.commonUtils.split(entry.key);

         //feature generation
         let tileTreeNoise = {
            woodlands: noise(treeSeeds['woodlands1'] + keyObj.q / noiseFluctuation, treeSeeds['woodlands1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['woodlands2'] + keyObj.q / noiseFluctuation, treeSeeds['woodlands2'] + keyObj.r / noiseFluctuation),
            grasshill: noise(treeSeeds['woodlands1'] + keyObj.q / noiseFluctuation, treeSeeds['woodlands1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['woodlands2'] + keyObj.q / noiseFluctuation, treeSeeds['woodlands2'] + keyObj.r / noiseFluctuation),
            tundra: noise(treeSeeds['tundra1'] + keyObj.q / noiseFluctuation, treeSeeds['tundra1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['tundra2'] + keyObj.q / noiseFluctuation, treeSeeds['tundra2'] + keyObj.r / noiseFluctuation),
            snowhill: noise(treeSeeds['tundra1'] + keyObj.q / noiseFluctuation, treeSeeds['tundra1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['tundra2'] + keyObj.q / noiseFluctuation, treeSeeds['tundra2'] + keyObj.r / noiseFluctuation),
            desert: noise(treeSeeds['desert1'] + keyObj.q / noiseFluctuation, treeSeeds['desert1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['desert1'] + keyObj.q / noiseFluctuation, treeSeeds['desert1'] + keyObj.r / noiseFluctuation),
            sandhill: noise(treeSeeds['desert1'] + keyObj.q / noiseFluctuation, treeSeeds['desert1'] + keyObj.r / noiseFluctuation) * noise(treeSeeds['desert1'] + keyObj.q / noiseFluctuation, treeSeeds['desert1'] + keyObj.r / noiseFluctuation),
         }

         let tileRockNoise = noise(rockSeeds[0] + keyObj.q / noiseFluctuation, rockSeeds[0] + keyObj.r / noiseFluctuation) * noise(rockSeeds[1] + keyObj.q / noiseFluctuation, rockSeeds[1] + keyObj.r / noiseFluctuation)

         if (tileTreeNoise[entry.value.biome] > BIOME_CONSTANTS[entry.value.biome].terrainGenThreshold && !this.structureBuilderUtils.maxNeighbors(keyObj.q, keyObj.r, entry.value.biome)) {

            switch (entry.value.biome) {
               case 'woodlands':
               case 'grasshill':
                  this.structureData.setModifier(keyObj.q, keyObj.r, 'oakTrees')
                  break;
               case 'tundra':
               case 'snowhill':
                  this.structureData.setModifier(keyObj.q, keyObj.r, 'spruceTrees')
                  break;
               case 'desert':
               case 'sandhill':
                  this.structureData.setModifier(keyObj.q, keyObj.r, 'cacti')
                  break;
               default:
                  continue;
            }


         } else if (BIOME_CONSTANTS[entry.value.biome].rockGenThreshold && tileRockNoise > BIOME_CONSTANTS[entry.value.biome].rockGenThreshold) {
            this.structureData.setModifier(keyObj.q, keyObj.r, 'smallRocks')
         }


      }

   }
}