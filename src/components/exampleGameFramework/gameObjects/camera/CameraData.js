export default class CameraDataClass {

    constructor(maxZoom, initRotation) {

        this.position = {
            x: 0,
            y: 0
        }

        this.rotation = initRotation;
        this.zoom = 0;

        this.anchorPoint = null;
        this.mouseAnchorPoint = null;

        this.maxZoom = maxZoom;

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

    setAnchorPoint = (x, y) => {
        this.anchorPoint = {
            x: this.position.x,
            y: this.position.y
        }

        this.mouseAnchorPoint = {
            x: x,
            y: y
        }
    }

    clearAnchorPoint = () => {
        this.anchorPoint = null;
        this.mouseAnchorPoint = null;
    }

}