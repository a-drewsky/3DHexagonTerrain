export default class UserConstantsClass {

    constructor(externalSettings){

        
        this.MAP_SIZE = externalSettings.mapSize == 'small' ? {size: 'small', q: 2, r: 3} 
            : externalSettings.mapSize == 'medium' ? {size: 'medium', q: 3, r: 4} 
            : externalSettings.mapSize == 'large' ? {size: 'large', q: 4, r: 5} 
            : externalSettings.mapSize == 'extralarge' ? {size: 'extralarge', q: 6, r: 7}
            : {size: 'massive', q: 9, r: 10}
            //r must be odd for mirrored map to work

        this.DEBUG = false;

    }

}