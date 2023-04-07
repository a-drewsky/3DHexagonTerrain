import TileGroundShadowDataClass from "./TileGroundShadowData";
import TileStackRendererClass from "./TileStackRenderer";

export default class TileGroundShadowClass{

    constructor(){
        this.data = new TileGroundShadowDataClass()
        this.renderer = new TileStackRendererClass()
    }

}