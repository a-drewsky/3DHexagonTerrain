import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";
import CameraSettingsClass from "./CameraSettings";

export default class CameraClass {

    constructor(canvas, maxZoom, initRotation){
        this.settings = new CameraSettingsClass();
        this.data = new CameraDataClass(maxZoom, initRotation);
        this.controller = new CameraControllerClass(this.data, canvas);
    }

    update = (state) => {
        this.data.position.x += this.data.velocity.x * this.settings.CAMERA_SPEED
        this.data.position.y += this.data.velocity.y * this.settings.CAMERA_SPEED
    }

    draw = () => {
        
    }

}