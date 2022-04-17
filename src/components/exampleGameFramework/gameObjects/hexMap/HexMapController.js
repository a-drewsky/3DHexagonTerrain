export default class HexMapControllerClass {

    constructor(hexMapData){

        this.hexMapData = hexMapData;

    }

    click = (x, y) => {
        let hexClicked = {
            q: (Math.sqrt(3) / 3 * (x - this.hexMapData.x) - 1 / 3 * ((y - this.hexMapData.y) * (1 / this.hexMapData.squish))) / this.hexMapData.size,
            r: (y - this.hexMapData.y) * (1 / this.hexMapData.squish) * (2 / 3) / this.hexMapData.size
         }
         hexClicked = this.hexMapData.roundToNearestHex(hexClicked);

         if(this.hexMapData.hasEntry(hexClicked.q, hexClicked.r)) return hexClicked;

         return null;
    }

    keyPress = (key) => {
        this.hexMapData.rotation++;
        if (this.hexMapData.rotation == 12) this.hexMapData.rotation = 0;
    }

}