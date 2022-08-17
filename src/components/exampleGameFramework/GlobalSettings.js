export default class SettingsClass {

    constructor(externalSettings){

        this.ZOOM_MULTIPLIER = 5;

        this.MAX_ZOOM = 1;
        
        this.MAP_SIZE = externalSettings.mapSize == 'small' ? {size: 'small', q: 12, r: 30} 
            : externalSettings.mapSize == 'medium' ? {size: 'medium', q: 16, r: 40} 
            : {size: 'large', q: 20, r: 50} 


    }

}