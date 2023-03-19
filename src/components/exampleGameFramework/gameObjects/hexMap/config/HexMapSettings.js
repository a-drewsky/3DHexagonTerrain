export default class HexMapSettingsClass {

    constructor(settings){

        this.DEBUG = settings.DEBUG

        this.TRAVEL_TIME = 500

        // this.MINE_TIME = 2000
        // this.ATTACK_TIME = 1600
        // this.AMIMATION_RATE = 1000/6

        this.JUMP_AMOUNT = 4

        this.MIRROR_MAP = false;

        this.TABLE_HEIGHT = 40;

        this.HEXMAP_LINE_WIDTH = 3;

        this.HEXMAP_SQUISH = 2/3;

        this.SHADOW_SIZE = 0.8;

        this.TILE_HEIGHT = 12;
        
        this.HEXMAP_SIDE_COLOR_MULTIPLIER = 1.1;

        this.TILE_SIZE = 20;

        this.SHADOW_ROTATION = 1;

        this.INIT_CAMERA_POSITION = 'bottom' //top, middle or bottom

        this.MAX_ELEVATION = 12;

        this.SAND_HILL_ELVATION_DIVISOR = 1.75;

        this.ELEVATION_MULTIPLIER = 48;
        
        this.SEED_MULTIPLIER = 10;

        this.SECOND_MINE_CHANCE = 0.4

        this.THIRD_MINE_CHACE = 0.2

        this.CELL_SIZE = {
            q: 7,
            r: 10
        }

        this.TEMP_TABLE_COLORS = {
            fill: {h: 150, s: 30, l: 65},
            stroke: {h: 150, s: 30, l: 55}
        }

        this.TEMP_RANGES = {
            tundra: 0.15,
            woodlands: 0.28,
            savanna: 0.36,
            desert: 1
        }

        this.WATER_TEMP_RANGES = {
            frozenwater: 0.12,
            water: 0.42,
            playa: 1
        }

        this.HEXMAP_ELEVATION_RANGES = {
            verylow: 1,
            low: 2,
            mid: 5,
            high: 7,
            veryhigh: 9
        }

        this.LOW_TERRAIN_GENERATION_RANGES = {
            1: 8,
            2: 13,
            3: 16,
            4: 18
        }

        this.BIOME_GENERATION = {
            snowmountain: {
                biomeGroup: ['tundra', 'rockmountain', 'snowhill'],
                minBiomeSmoothing: 6,
                terrainGenThreshold: null,
                terrainGenMaxNeighbors: null,
                rockGenThreshold: 0.4
            },
            rockmountain: {
                biomeGroup: ['grasshill', 'snowmountain'],
                minBiomeSmoothing: 6,
                terrainGenThreshold: null,
                terrainGenMaxNeighbors: null,
                rockGenThreshold: 0.4
            },
            snowhill: {
                biomeGroup: ['tundra', 'rockmountain', 'snowmountain'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: 0.4,
                terrainGenMaxNeighbors: 6,
                rockGenThreshold: 0.45
            },
            grasshill: {
                biomeGroup: ['rockmountain', 'snowmountain'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: 0.4,
                terrainGenMaxNeighbors: 6,
                rockGenThreshold: 0.5
            },
            savannahill: {
                biomeGroup: ['rockmountain', 'snowmountain'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: 0.5,
                terrainGenMaxNeighbors: 0,
                rockGenThreshold: 0.5
            },
            sandhill: {
                biomeGroup: ['desert', 'mesa', 'rockhill'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: 0.5,
                terrainGenMaxNeighbors: 0,
                rockGenThreshold: 0.45
            },
            woodlands: {
                biomeGroup: ['grasshill'],
                minBiomeSmoothing: 12,
                terrainGenThreshold: 0.35,
                terrainGenMaxNeighbors: 6,
                rockGenThreshold: 0.5
            },
            savanna: {
                biomeGroup: ['grasshill'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: 0.45,
                terrainGenMaxNeighbors: 0,
                rockGenThreshold: 0.5
            },
            tundra: {
                biomeGroup: ['snowmountain', 'frozenwater'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: 0.4,
                terrainGenMaxNeighbors: 6,
                rockGenThreshold: 0.45
            },
            desert: {
                biomeGroup: ['mesa', 'rockhill', 'sandhill'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: 0.45,
                terrainGenMaxNeighbors: 1,
                rockGenThreshold: 0.4
            },
            water: {
                biomeGroup: ['frozenwater', 'playa'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: null,
                terrainGenMaxNeighbors: null,
                rockGenThreshold: null
            },
            frozenwater: {
                biomeGroup: ['tundra', 'snowmountain'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: null,
                terrainGenMaxNeighbors: null,
                rockGenThreshold: null
            },
            playa: {
                biomeGroup: ['desert', 'sandhill'],
                minBiomeSmoothing: 10,
                terrainGenThreshold: null,
                terrainGenMaxNeighbors: null,
                rockGenThreshold: null
            }
        }

        this.MAP_SIZES = {
            small: {
                noiseFluctuation: 5,
                bufferSize: 3
            },
            medium: {
                noiseFluctuation: 6,
                bufferSize: 4
            },
            large: {
                noiseFluctuation: 7,
                bufferSize: 5
            },
            extralarge: {
                noiseFluctuation: 8,
                bufferSize: 7
            },
            massive: {
                noiseFluctuation: 9,
                bufferSize: 10
            },
        }
        
        this.MODIFIERS = {
            woodland_trees: {
                secondSpriteChance: 0.4,
                spriteIncrementChance: 0.2
            },
            tundra_trees: {
                secondSpriteChance: 0.6,
                spriteIncrementChance: 0.2
            },
            desert_trees: {
                secondSpriteChance: 0.6,
                spriteIncrementChance: 0.3
            },
            small_rocks: {
                secondSpriteChance: 0.4,
                spriteIncrementChance: 0.2
            }
        }

    }

}