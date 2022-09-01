import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapSettingsClass from "./HexMapSettings"

export default class HexMapClass {

    constructor(
        ctx,
        canvas,
        camera,
        zoomMultiplier,
        images
    ) {
        this.settings = new HexMapSettingsClass()

        this.data1 = new HexMapDataClass(
            0,
            0,
            this.settings.BASE_ZOOM_LEVEL,
            this.settings.HEXMAP_SQUISH,
            this.settings.TILE_HEIGHT,
            this.settings.INIT_SHADOW_ROTATION
        );

        this.data = this.data1

        this.view1 = new HexMapViewClass(
            ctx,
            canvas,
            camera,
            this.data1,
            this.settings.HEXMAP_LINE_WIDTH,
            this.settings.SHADOW_SIZE,
            this.settings.TABLE_HEIGHT,
            this.settings.INIT_CAMERA_POSITION,
            this.settings.INIT_CAMERA_ROTATION,
            this.settings.HEXMAP_COLORS,
            this.settings.HEXMAP_SIDE_COLOR_MULTIPLIER,
            zoomMultiplier,
            this.settings.HEXMAP_ELEVATION_RANGES,
            this.settings.DEBUG,
            this.settings.GEOMTRIC_TILES_DEBUG,
            images
        );
        
        this.view = this.view1
        
        this.builder = new HexMapBuilderClass(
            this.data1,
            this.view1,
            this.settings.HEXMAP_ELEVATION_RANGES,
            this.settings.LOW_TERRAIN_GENERATION_RANGES,
            this.settings.MAX_ELEVATION,
            this.settings.ELEVATION_MULTIPLIER,
            this.settings.SEED_MULTIPLIER,
            this.settings.NOISE_FLUCTUATION,
            this.settings.TEMP_RANGES,
            this.settings.WATER_TEMP_RANGES,
            this.settings.BIOME_GROUPS,
            this.settings.MIN_BIOME_SMOOTHING,
            this.settings.SAND_HILL_ELVATION_DIVISOR
        );

        if(this.settings.DEBUG){
            this.data2 = new HexMapDataClass(
                0,
                0,
                this.settings.BASE_ZOOM_LEVEL,
                this.settings.HEXMAP_SQUISH,
                this.settings.TILE_HEIGHT,
                this.settings.INIT_SHADOW_ROTATION
            );
    
            this.view2 = new HexMapViewClass(
                ctx,
                canvas,
                camera,
                this.data2,
                this.settings.HEXMAP_LINE_WIDTH,
                this.settings.SHADOW_SIZE,
                this.settings.TABLE_HEIGHT,
                this.settings.INIT_CAMERA_POSITION,
                this.settings.INIT_CAMERA_ROTATION,
                this.settings.HEXMAP_COLORS,
                this.settings.HEXMAP_SIDE_COLOR_MULTIPLIER,
                zoomMultiplier,
                this.settings.HEXMAP_ELEVATION_RANGES,
                this.settings.DEBUG,
                this.settings.GEOMTRIC_TILES_DEBUG,
                images
            );

            this.builder.hexMapData2 = this.data2
            this.builder.hexMapView2 = this.view2
            this.viewNum = 1
        }


        this.controller = new HexMapControllerClass(this.data);
    }

    update = (switchView) => {

    }

    draw = () => {
        this.view.draw();
    }

    switchView = () => {
        if(!this.settings.DEBUG) return

        if(this.viewNum == 1){
            this.viewNum = 2
            this.view = this.view2
            this.data = this.data2
        } else {
            this.viewNum = 1
            this.view = this.view1
            this.data = this.data1
        }
    }

}