export default class SettingsClass {

    constructor(externalSettings){

        this.ZOOM_MULTIPLIER = 10;

        this.MAX_ZOOM = 1;
        
        this.MAP_SIZE = externalSettings.mapSize == 'small' ? {size: 'small', q: 15, r: 30} 
            : externalSettings.mapSize == 'medium' ? {size: 'medium', q: 20, r: 40} 
            : externalSettings.mapSize == 'large' ? {size: 'large', q: 25, r: 50} 
            : externalSettings.mapSize == 'extralarge' ? {size: 'extralarge', q: 35, r: 70}
            : {size: 'extralarge', q: 50, r: 100}


    }

}