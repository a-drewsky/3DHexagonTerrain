export default class HexMapSettingsClass {

    constructor(){

        this.DEBUG = false;

        this.TABLE_HEIGHT = 50;

        this.HEXMAP_LINE_WIDTH = 3; //to be removed

        this.HEXMAP_SQUISH = 2/3;

        this.SHADOW_SIZE = 1;

        this.TILE_HEIGHT = 10;
        
        this.HEXMAP_SIDE_COLOR_MULTIPLIER = 1.1;

        this.BASE_ZOOM_LEVEL = 30;

        this.INIT_CAMERA_ROTATION = 2;

        this.INIT_SHADOW_ROTATION = 11;

        this.INIT_CAMERA_POSITION = {
            x: 0.25,
            y: 0.5
        };


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
            rockhill: {
                fill: {h: 30, s: 60, l: 50},
                stroke: {h: 30, s: 60, l: 40}
            },
            grasshill: {
                fill: {h: 120, s: 100, l: 28},
                stroke: {h: 120, s: 100, l: 23}
            },
            sandhill: {
                fill: {h: 45, s: 60, l: 60},
                stroke: {h: 45, s: 60, l: 45}
            },
            mesa: {
                fill: {h: 20, s: 60, l: 50},
                stroke: {h: 20, s: 60, l: 40}
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
            frozenWater: {
                fill: {h: 190, s: 80, l: 80},
                stroke: {h: 190, s: 80, l: 90}
            },
            playa: {
                fill: {h: 45, s: 30, l: 80},
                stroke: {h: 45, s: 30, l: 90}
            }
        }

        // this.BIOME_GROUPSXXX = [
        //     ['rockhill', 'sandhill', 'desert', 'mesa'],
        //     ['snowmountain', 'tundra'],
        //     ['grasshill', 'rockmountain'],
        //     ['woodlands'],
        //     ['savanna'],
        //     ['water', 'frozenWater', 'playa']
        // ]

        this.BIOME_GROUPS = {
            snowmountain: ['tundra', 'rockmountain'],
            rockmountain: ['grasshill', 'snowmountain'],
            rockhill: ['mesa', 'sandhill', 'desert'],
            grasshill: ['rockmountain', 'woodlands', 'savanna'],
            sandhill: ['desert', 'mesa', 'rockhill'],
            mesa: ['rockhill', 'sandhill', 'desert'],
            woodlands: ['grasshill'],
            savanna: ['grasshill'],
            tundra: ['snowmountain', 'frozenWater'],
            desert: ['mesa', 'rockhill', 'sandhill'],
            water: ['frozenWater', 'playa'],
            frozenWater: ['water'],
            playa: ['water']
        }

        this.MINIMUM_BIOME_SIZES = {
            single: 3,
            group: 7
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

        this.ELEVATION_MULTIPLIER = 48;
        
        this.SEED_MULTIPLIER = 10;

        this.NOISE_FLUCTUATION = {
            small: 6,
            medium: 7,
            large: 8
        }

        this.TEMP_RANGES = {
            tundra: 0.15,
            woodlands: 0.28,
            savanna: 0.36,
            desert: 1
        }

        this.WATER_TEMP_RANGES = {
            frozenWater: 0.12,
            water: 0.42,
            playa: 1
        }

    }

}