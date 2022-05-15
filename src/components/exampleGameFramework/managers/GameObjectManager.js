
//Import Game Object
import HexMapClass from "../gameObjects/hexMap/HexMap"
import CameraClass from "../gameObjects/camera/Camera";

export default class GameObjectManagerClass {

    constructor(ctx, canvas, settings) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.settings = settings;

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
            state: this.objectStates.disabled
        });
        this.objectMap.set("hexMap", {
            object: new HexMapClass(
                this.ctx, 
                this.objectMap.get("camera").object.data, 
                0, 0, 
                this.settings.BASE_ZOOM_LEVEL, 
                this.settings.HEXMAP_SQUISH, 
                this.settings.HEXMAP_LINE_WIDTH,
                this.settings.SHADOW_SIZE,
                this.settings.TILE_HEIGHT,
                this.settings.TABLE_HEIGHT,
                this.settings.INIT_SHADOW_ROTATION,
                this.settings.INIT_CAMERA_POSITION,
                this.settings.INIT_CAMERA_ROTATION,
                this.settings.HEXMAP_COLORS,
                this.settings.HEXMAP_SIDE_COLOR_MULTIPLIER,
                this.settings.ZOOM_MULTIPLIER
                ),
            state: this.objectStates.active
        });


        //build game objects
        this.objectMap.get('hexMap').object.builder.build(this.settings.MAP_SIZE.q, this.settings.MAP_SIZE.r, 0, true);
        
    }

}