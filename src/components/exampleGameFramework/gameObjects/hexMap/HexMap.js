import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"

export default class HexMapClass {

    constructor(ctx, camera, x, y, size, squish){
        this.data = new HexMapDataClass(x, y, size, squish);
        this.builder = new HexMapBuilderClass(this.data);
        this.controller = new HexMapControllerClass(this.data);
        this.view = new HexMapViewClass(ctx, camera, this.data);
    }

}