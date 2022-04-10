import CameraControllerClass from "./CameraController";
import CameraDataClass from "./CameraData";

export default class CameraClass {

    constructor(){
        this.data = new CameraDataClass();
        this.controller = new CameraControllerClass(this.data);
    }

}