export default class SettingsClass {

    constructor(externalSettings){

        this.ZOOM_MULTIPLIER = 10;

        this.MAX_ZOOM = 1;
        
        this.ROTATION_AMOUNT = 2
        
        this.MAP_SIZE = externalSettings.mapSize == 'small' ? {size: 'small', q: 15, r: 31} 
            : externalSettings.mapSize == 'medium' ? {size: 'medium', q: 20, r: 41} 
            : externalSettings.mapSize == 'large' ? {size: 'large', q: 25, r: 51} 
            : externalSettings.mapSize == 'extralarge' ? {size: 'extralarge', q: 35, r: 71}
            : {size: 'extralarge', q: 50, r: 101}
            //r must be odd for mirrored map to work


    }

}