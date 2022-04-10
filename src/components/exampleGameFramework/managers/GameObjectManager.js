
//Import Game Object
import HexMapClass from "../gameObjects/hexMap/HexMap"
import CameraClass from "../gameObjects/camera/Camera";

export default class GameObjectManagerClass {

    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

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
    createObjects = (settings) => {

        //Initialize game objects
        this.objectMap.set("camera", {
            object: new CameraClass(), //temporary attributes. Will become dynamic when camera is implemented
            state: this.objectStates.disabled
        });
        this.objectMap.set("hexMap", {
            object: new HexMapClass(this.ctx, this.objectMap.get("camera").object.data, 0, 0, 30, 2/3), //temporary attributes. Will become dynamic when camera is implemented
            state: this.objectStates.active
        });


        //build game objects
        this.objectMap.get('hexMap').object.builder.build(20, 45, 0, true);
        this.objectMap.get('hexMap').object.view.render();
        
    }

}