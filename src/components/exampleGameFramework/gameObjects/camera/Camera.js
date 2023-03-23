import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";
import CameraSettingsClass from "./CameraSettings";

export default class CameraClass {

    constructor(canvas){
        this.settings = new CameraSettingsClass();
        this.data = new CameraDataClass(this.settings);
        this.controller = new CameraControllerClass(this.data, canvas);

    }

}