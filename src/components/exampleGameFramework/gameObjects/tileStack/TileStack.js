import TileStackDataClass from "./TileStackData";
import TileStackRendererClass from "./TileStackRenderer";

export default class TileStackClass {

    constructor(){
        this.data = new TileStackDataClass()
        this.renderer = new TileStackRendererClass()
    }

}