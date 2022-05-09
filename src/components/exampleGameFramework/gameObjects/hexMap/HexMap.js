import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"

export default class HexMapClass {

    constructor(ctx, camera, x, y, size, squish, lineWidth, shadowSize, tileHeight, tableHeight, initShadowRotation, initCameraPosition, colors, sideColorMultiplier){
        this.data = new HexMapDataClass(x, y, size, squish, tileHeight, initShadowRotation);
        this.view = new HexMapViewClass(ctx, camera, this.data, lineWidth, shadowSize, tableHeight, initCameraPosition, colors, sideColorMultiplier);
        this.builder = new HexMapBuilderClass(this.data, this.view);
        this.controller = new HexMapControllerClass(this.data);
    }

}