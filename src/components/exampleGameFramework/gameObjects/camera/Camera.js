import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";
import CameraSettingsClass from "./CameraSettings";

export default class CameraClass {

    constructor(){
        this.settings = new CameraSettingsClass();
        this.data = new CameraDataClass(
            this.settings.MAX_ZOOM,
            this.settings.ZOOM_AMOUNT,
            this.settings.ROTATION_AMOUNT,
            this.settings.INIT_CAMERA_ROTATION,
            this.settings.CAMERA_SPEED
            );
        this.controller = new CameraControllerClass(this.data);

    }

    update = (state) => {
        this.data.position.x += this.data.velocity.x * this.data.cameraSpeed
        this.data.position.y += this.data.velocity.y * this.data.cameraSpeed
    }

    draw = () => {
        
    }

}