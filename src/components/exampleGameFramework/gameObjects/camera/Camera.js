import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";
import CameraSettingsClass from "./CameraSettings";

export default class CameraClass {

    constructor(canvas){
        this.settings = new CameraSettingsClass();
        this.data = new CameraDataClass(this.settings.MAX_ZOOM);
        this.controller = new CameraControllerClass(this.data, canvas);
    }

    update = (state) => {
        
    }

    draw = () => {
        
    }

}