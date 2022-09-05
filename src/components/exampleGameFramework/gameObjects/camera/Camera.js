import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";

export default class CameraClass {

    constructor(canvas, maxZoom, initRotation, rotationPattern){
        this.data = new CameraDataClass(maxZoom, initRotation);
        this.controller = new CameraControllerClass(this.data, canvas, rotationPattern);
    }

    update = (state) => {

    }

    draw = () => {
        
    }

}