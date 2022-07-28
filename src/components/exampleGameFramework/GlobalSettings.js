export default class SettingsClass {

    constructor(externalSettings){

        this.ZOOM_MULTIPLIER = 3;

        this.MAX_ZOOM = 2;
        
        this.MAP_SIZE = externalSettings.mapSize == 'small' ? { q: 12, r: 30} 
            : externalSettings.mapSize == 'medium' ? { q: 16, r: 40} 
            : { q: 20, r: 50} 


    }

}