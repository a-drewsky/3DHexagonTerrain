import HexMapClass from "./gameObjects/hexMap/HexMap"
import HexMapDebugSmoothingClass from "./gameObjects/hexMap/debug/HexMapDebugSmoothing";
import CameraClass from "./gameObjects/camera/Camera";


export default class GameManagerClass {

    constructor(ctx, canvas, settings, images, uiComponents, updateUi) {

        this.ctx = ctx;
        this.canvas = canvas;
        this.settings = settings;
        this.images = images;

        this.objectMap = new Map();

        //create all state objects like this
        this.state = {
            play: 'play',
            pause: 'pause'
        }
        this.state.current = this.state.play

        this.uiComponents = uiComponents
        this.updateUi = updateUi
    }

    //Set up function
    createObjects = () => {

        //Initialize game objects
        this.objectMap.set("camera", new CameraClass(this.canvas)
        );

        if (this.settings.DEBUG) {
            this.objectMap.set("hexMap",
                new HexMapDebugSmoothingClass(
                    this.ctx,
                    this.canvas,
                    this.objectMap.get("camera").data,
                    this.images,
                    this.settings
                )
            );
        } else {
            this.objectMap.set("hexMap",
                new HexMapClass(
                    this.ctx,
                    this.canvas,
                    this.objectMap.get("camera").data,
                    this.objectMap.get("camera").controller,
                    this.images,
                    this.settings,
                    this.uiComponents,
                    this.updateUi,
                    this.state
                )
            );
        }

        this.objectMap.get('hexMap').build(this.settings.MAP_SIZE.q, this.settings.MAP_SIZE.r, this.settings.MAP_SIZE.size);
        console.log("DONE BUILDING")
        this.objectMap.get('hexMap').prerender();

    }

    setStatePause = () => {
        this.state.current = this.state.pause
        this.uiComponents.pauseMenu.show = true
        this.updateUi()
    }

    setStatePlay = () => {
        this.state.current = this.state.play
        this.uiComponents.pauseMenu.show = false
        this.updateUi()
    }

}