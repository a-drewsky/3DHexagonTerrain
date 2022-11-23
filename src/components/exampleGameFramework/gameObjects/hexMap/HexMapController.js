
import HexMapViewUtilsClass from "./HexMapViewUtils";
import CollisionClass from '../../utilities/collision';

export default class HexMapControllerClass {

    constructor(hexMapData, camera, canvas) {

        this.hexMapData = hexMapData;

        this.camera = camera;

        this.canvas = canvas


        this.utils = new HexMapViewUtilsClass(this.hexMapData, this.camera);

        this.collision = new CollisionClass();

    }

    click = (x, y) => {

        x *= (this.canvas.width + this.camera.zoom * this.camera.zoomAmount) / this.canvas.width
        y *= (this.canvas.height + this.camera.zoom * this.camera.zoomAmount * (this.canvas.height / this.canvas.width)) / this.canvas.height

        
        let ogPos = {
            x: x,
            y: y
        }

        x+=this.camera.position.x
        y+=this.camera.position.y

        x -= this.hexMapData.posMap.get(this.camera.rotation).x

        y -= this.hexMapData.posMap.get(this.camera.rotation).y

        console.log(x, y)


        let hexClicked = {
            q: ( (2/3 * x )                       ) / this.hexMapData.size,
            r: ((-1/3 * x )  +  (Math.sqrt(3)/3) * (y * (1/this.hexMapData.squish))) / this.hexMapData.size
        }

        hexClicked = this.hexMapData.roundToNearestHex(hexClicked.q, hexClicked.r)

        console.log(hexClicked)

        let testList = [{ q: 0, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 0 }, { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 }, { q: -1, r: 3 }, { q: 0, r: 3 }, { q: 1, r: 2 }, { q: -1, r: 4 }, { q: 0, r: 4 }, { q: 1, r: 3 }]

        
        let tileClicked = null

        for(let i=0; i<testList.length; i++){
            let testTile = {
                q: hexClicked.q + testList[i].q,
                r: hexClicked.r + testList[i].r
            }

            if(!this.hexMapData.hasEntry(testTile.q, testTile.r)) continue;

            let hexPos = this.utils.hexPositionToXYPosition(testTile, this.hexMapData.getEntry(testTile.q, testTile.r).height)

            hexPos.x -= this.camera.position.x
            hexPos.y -= this.camera.position.y


            if(this.collision.pointHex(ogPos.x, ogPos.y, hexPos.x, hexPos.y, this.hexMapData.size, this.hexMapData.squish)){
                console.log(hexPos.x, hexPos.y)
                tileClicked = testTile
            }

        }
        

        for (let [key, value] of this.hexMapData.getMap()) {
            if(value.selected == true){
                let keyObj = this.hexMapData.split(key)
                value.selected = false
                this.hexMapData.setEntry(keyObj.q, keyObj.r, value)
            }
        }

        if(!tileClicked) return;

        
        let tile = this.hexMapData.getEntry(tileClicked.q, tileClicked.r)
        tile.selected = true
        this.hexMapData.setEntry(tileClicked.q, tileClicked.r, tile)

        console.log(tileClicked)
    }

    keyPress = (key) => {

    }

}