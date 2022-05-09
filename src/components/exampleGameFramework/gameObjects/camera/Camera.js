import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";

export default class CameraClass {

    constructor(canvas, maxZoom, initRotation){
        this.data = new CameraDataClass(maxZoom, initRotation);
        this.controller = new CameraControllerClass(this.data, canvas);
    }

}