import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";
import CameraSettingsClass from "./CameraSettings";

export default class CameraClass {

    constructor(canvas){
        this.settings = new CameraSettingsClass();
        this.data = new CameraDataClass(this.settings);
        this.controller = new CameraControllerClass(this.data, canvas);

    }

    update = (state) => {
        this.data.position.x += this.data.velocity.x * this.data.cameraSpeed
        this.data.position.y += this.data.velocity.y * this.data.cameraSpeed
    }

    draw = () => {
        
    }

}