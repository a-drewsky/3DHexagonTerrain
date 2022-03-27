
//Import Game Object
import HexMapClass from "../gameObjects/hexMap/HexMap"

export default class GameObjectManagerClass {

    constructor(ctx) {
        this.ctx = ctx;

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
        this.objectMap.set("hexMap", {
            object: new HexMapClass(this.ctx, 30, 30, 15, 0.8),
            state: this.objectStates.active
        });

        //build game objects
        this.objectMap.get('hexMap').object.builder.build(20, 20, 0, false);
    }

}