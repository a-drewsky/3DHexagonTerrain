import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";
import CameraSettingsClass from "./CameraSettings";
import CameraUpdaterClass from "./CameraUpdater";

export default class CameraClass {

    constructor(hexMapData, canvas){
        this.settings = new CameraSettingsClass();
        this.data = new CameraDataClass(this.settings);
        this.controller = new CameraControllerClass(this.data, canvas);
        this.updater = new CameraUpdaterClass(hexMapData, this.data, canvas)
    }

    prerender = (drawCanvas) => {
        this.updater.prerender(drawCanvas)
    }

}