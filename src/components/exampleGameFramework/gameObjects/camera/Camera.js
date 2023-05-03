import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";
import CameraUpdaterClass from "./CameraUpdater";

export default class CameraClass {

    constructor(hexMapData, canvas){
        this.data = new CameraDataClass(hexMapData, canvas);
        this.controller = new CameraControllerClass(this.data, canvas);
        this.updater = new CameraUpdaterClass(hexMapData, this.data, this.controller, canvas)
    }

    prerender = (drawCanvas) => {
        this.updater.prerender(drawCanvas)
    }

}