export default class SettingsClass {

    constructor(externalSettings){

        this.MAP_SIZE = externalSettings.mapSize == 'small' ? { q: 12, r: 30} 
            : externalSettings.mapSize == 'medium' ? { q: 16, r: 40} 
            : { q: 20, r: 50} 

        this.BASE_ZOOM_LEVEL = 30;

        this.ZOOM_MULTIPLIER = 3;

        this.MAX_ZOOM = 2;

        this.HEXMAP_LINE_WIDTH = 3;

        this.HEXMAP_SQUISH = 2/3;

        this.SHADOW_SIZE = 1;

        this.TILE_HEIGHT = 10;

        this.TABLE_HEIGHT = 50;

        this.INIT_CAMERA_ROTATION = 2;

        this.INIT_SHADOW_ROTATION = 11;

        this.INIT_CAMERA_POSITION = {
            x: 0.25,
            y: 0.5
        };

        this.HEXMAP_COLORS = {
            TABLE_FILL: {h: 150, s: 30, l: 65},
            TABLE_STROKE: {h: 150, s: 30, l: 55},

            SNOW_FILL: {h: 210, s: 20, l: 90},
            SNOW_STROKE: {h: 210, s: 20, l: 80},

            ROCKS_FILL: {h: 30, s: 60, l: 50},
            ROCKS_STROKE: {h: 30, s: 60, l: 40},

            GRASS_FILL: {h: 120, s: 100, l: 25},
            GRASS_STROKE: {h: 120, s: 100, l: 20},

            WATER_FILL: {h: 190, s: 90, l: 50},
            WATER_STROKE: {h: 190, s: 90, l: 70},
        }

        this.HEXMAP_SIDE_COLOR_MULTIPLIER = 1.1;

    }

}