export default class HexMapSettingsClass {

    constructor(){

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
                fill: {h: 30, s: 60, l: 50},
                stroke: {h: 30, s: 60, l: 40}
            },
            grasshill: {
                fill: {h: 120, s: 100, l: 25},
                stroke: {h: 120, s: 100, l: 20}
            },
            woodlands: {
                fill: {h: 120, s: 100, l: 25},
                stroke: {h: 120, s: 100, l: 20}
            },
            water: {
                fill: {h: 190, s: 90, l: 50},
                stroke: {h: 190, s: 90, l: 70}
            }
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

    }

}