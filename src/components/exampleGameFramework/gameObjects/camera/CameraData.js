export default class CameraDataClass {

    constructor() {

        this.position = {
            x: 0,
            y: 0
        }

        this.rotation = 0;
        this.zoom = 0;

    }

    setPosition = (x, y) => {
        this.position = {
            x: x,
            y: y
        }
    }

    setRotation = (rotation) => {
        this.rotation = rotation;
    }

    setZoom = (zoom) => {
        this.zoom = zoom;
    }

}