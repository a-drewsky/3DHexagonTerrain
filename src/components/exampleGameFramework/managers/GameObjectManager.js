
//Import Game Object
import HexMapClass from "../gameObjects/hexMap/HexMap"
import CameraClass from "../gameObjects/camera/Camera";

export default class GameObjectManagerClass {

    constructor(ctx, canvas, settings, images) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.settings = settings;
        this.images = images;

        this.objectMap = new Map();

        this.objectStates = {
            disabled: 'disabled',
            inactive: 'inactive',
            active: 'active'
        }
    }

    //Set Object States
    setDisabled = (objectName) => {
        this.objectMap.get(objectName).object.data.setState(this.objectStates.disabled);
    }
    setInactive = (objectName) => {
        this.objectMap.get(objectName).object.data.setState(this.objectStates.inactive);
    }
    setActive = (objectName) => {
        this.objectMap.get(objectName).object.data.setState(this.objectStates.active);
    }

    //Delete Object
    deleteObject = (objectName) => {
        this.objectMap.delete(objectName);
    }

    //Set up function
    createObjects = () => {

        //Initialize game objects
        this.objectMap.set("camera", {
            object: new CameraClass(this.canvas, this.settings.MAX_ZOOM),
            state: this.objectStates.active
        });
        this.objectMap.set("hexMap", {
            object: new HexMapClass(
                this.ctx,
                this.canvas,
                this.objectMap.get("camera").object.data,
                this.settings.ZOOM_MULTIPLIER,
                this.images
            ),
            state: this.objectStates.active
        });


        //build game objects
        this.objectMap.get('hexMap').object.builder.build(this.settings.MAP_SIZE.q, this.settings.MAP_SIZE.r, this.settings.MAP_SIZE.size, true);

        this.objectMap.get('hexMap').object.view1.initialize()

        if (this.objectMap.get('hexMap').object.data2 !== undefined) {
            this.objectMap.get('hexMap').object.view2.initialize()
        }

    }

}