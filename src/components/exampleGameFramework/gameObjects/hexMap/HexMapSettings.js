export default class HexMapSettingsClass {

    constructor(){

        this.DEBUG = false;

        this.GEOMTRIC_TILES_DEBUG = false;

        this.MIRROR_MAP = false;

        this.TABLE_HEIGHT = 40;

        this.HEXMAP_LINE_WIDTH = 3;

        this.HEXMAP_SQUISH = 2/3;

        this.SHADOW_SIZE = 0.8;

        this.TILE_HEIGHT = 8;
        
        this.HEXMAP_SIDE_COLOR_MULTIPLIER = 1.1;

        this.TILE_SIZE = 40;

        this.SHADOW_ROTATION = 1;

        this.INIT_CAMERA_POSITION = 'middle' //top, middle or bottom

        this.CELL_SIZE = {
            q: 7,
            r: 10
        }


        //BIOME GENERATION

        this.HEXMAP_COLORS = {
            table: {
                fill: {h: 150, s: 30, l: 65},
                stroke: {h: 150, s: 30, l: 55}
            },
            snowmountain: {
                fill: {h: 210, s: 20, l: 90},
                stroke: {h: 210, s: 20, l: 80}
            },
            rockmountain: {
                fill: {h: 240, s: 10, l: 70},
                stroke: {h: 240, s: 10, l: 60}
            },
            snowhill: {
                fill: {h: 210, s: 20, l: 90},
                stroke: {h: 210, s: 20, l: 80}
            },
            grasshill: {
                fill: {h: 120, s: 100, l: 28},
                stroke: {h: 120, s: 100, l: 23}
            },
            savannahill: {
                fill: {h: 80, s: 80, l: 45},
                stroke: {h: 85, s: 80, l: 35}
            },
            sandhill: {
                fill: {h: 45, s: 60, l: 60},
                stroke: {h: 45, s: 60, l: 45}
            },
            woodlands: {
                fill: {h: 120, s: 90, l: 35},
                stroke: {h: 120, s: 90, l: 30}
            },
            savanna: {
                fill: {h: 80, s: 80, l: 45},
                stroke: {h: 85, s: 80, l: 35}
            },
            tundra: {
                fill: {h: 200, s: 50, l: 80},
                stroke: {h: 200, s: 50, l: 60}
            },
            desert: {
                fill: {h: 45, s: 50, l: 70},
                stroke: {h: 45, s: 50, l: 50}
            },
            water: {
                fill: {h: 190, s: 90, l: 50},
                stroke: {h: 190, s: 90, l: 70}
            },
            frozenwater: {
                fill: {h: 190, s: 80, l: 80},
                stroke: {h: 190, s: 80, l: 90}
            },
            playa: {
                fill: {h: 45, s: 30, l: 80},
                stroke: {h: 45, s: 30, l: 90}
            }
        }

        this.BIOME_GROUPS = {
            snowmountain: ['tundra', 'rockmountain', 'snowhill'],
            rockmountain: ['grasshill', 'snowmountain'],
            snowhill: ['tundra', 'rockmountain', 'snowmountain'],
            grasshill: ['rockmountain', 'snowmountain'],
            savannahill: ['rockmountain', 'snowmountain'],
            sandhill: ['desert', 'mesa', 'rockhill'],
            woodlands: ['grasshill'],
            savanna: ['grasshill'],
            tundra: ['snowmountain', 'frozenwater'],
            desert: ['mesa', 'rockhill', 'sandhill'],
            water: ['frozenwater', 'playa'],
            frozenwater: ['tundra', 'snowmountain'],
            playa: ['desert', 'sandhill']
        }

        this.MIN_BIOME_SMOOTHING = {
            snowmountain: 6,
            rockmountain: 6,
            snowhill: 10,
            grasshill: 10,
            savannahill: 10,
            sandhill: 10,
            woodlands: 12,
            savanna: 10,
            tundra: 10,
            desert: 10,
            water: 10,
            frozenwater: 10,
            playa: 10
        }

        this.TERRAIN_GENERATION_THERSHOLD = {
            snowmountain: null,
            rockmountain: null,
            snowhill: 0.4,
            grasshill: 0.4,
            savannahill: 0.5,
            sandhill: 0.5,
            woodlands: 0.35,
            savanna: 0.45,
            tundra: 0.4,
            desert: 0.45,
            water: null,
            frozenwater: null,
            playa: null
        }

        this.TERRAIN_GENERATION_MAX_NEIGHBORS = {
            snowmountain: null,
            rockmountain: null,
            snowhill: 6,
            grasshill: 6,
            savannahill: 0,
            sandhill: 0,
            woodlands: 6,
            savanna: 0,
            tundra: 6,
            desert: 1,
            water: null,
            frozenwater: null,
            playa: null
        }

        this.TERRAIN_ROCK_GEN_THRESHOLD = {
            snowmountain: 0.4,
            rockmountain: 0.4,
            snowhill: 0.45,
            grasshill: 0.5,
            savannahill: 0.5,
            sandhill: 0.45,
            woodlands: 0.5,
            savanna: 0.5,
            tundra: 0.45,
            desert: 0.45,
            water: null,
            frozenwater: null,
            playa: null
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

        this.MAX_ELEVATION = 12;

        this.SAND_HILL_ELVATION_DIVISOR = 1.75;

        this.ELEVATION_MULTIPLIER = 48;
        
        this.SEED_MULTIPLIER = 10;

        this.NOISE_FLUCTUATION = {
            small: 5,
            medium: 6,
            large: 7,
            extralarge: 8,
            massive: 9
        }
        
        this.BUFFER_SIZES = {
            small: 3,
            medium: 4,
            large: 5,
            extralarge: 7,
            massive: 10
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


        this.MODIFIER_SECOND_SPRITE_CHANCE = {
            oaktree: 0.4,
            tundratree: 0.6,
            deserttree: 0.6,
            rocks: 0.4
        }

        this.MODIFIER_SECOND_SPRITE_CHANCE_INCREMENT = {
            oaktree: 0.2,
            tundratree: 0.2,
            deserttree: 0.3,
            rocks: 0.2
        }

        this.SECOND_MINE_CHANCE = 0.4
        this.THIRD_MINE_CHACE = 0.2

    }

}