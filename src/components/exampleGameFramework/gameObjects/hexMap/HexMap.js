import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapSettingsClass from "./HexMapSettings"

export default class HexMapClass {

    constructor(
        ctx,
        camera,
        zoomMultiplier
    ) {
        this.settings = new HexMapSettingsClass()
        this.data = new HexMapDataClass(
            0, 
            0, 
            this.settings.BASE_ZOOM_LEVEL, 
            this.settings.HEXMAP_SQUISH, 
            this.settings.TILE_HEIGHT, 
            this.settings.INIT_SHADOW_ROTATION
            );

        this.view = new HexMapViewClass(
            ctx, 
            camera, 
            this.data, 
            this.settings.HEXMAP_LINE_WIDTH, 
            this.settings.SHADOW_SIZE, 
            this.settings.TABLE_HEIGHT, 
            this.settings.INIT_CAMERA_POSITION, 
            this.settings.INIT_CAMERA_ROTATION, 
            this.settings.HEXMAP_COLORS, 
            this.settings.HEXMAP_SIDE_COLOR_MULTIPLIER, 
            zoomMultiplier, 
            this.settings.HEXMAP_ELEVATION_RANGES
            );

        this.builder = new HexMapBuilderClass(
            this.data, 
            this.view, 
            this.settings.HEXMAP_ELEVATION_RANGES, 
            this.settings.LOW_TERRAIN_GENERATION_RANGES, 
            this.settings.MAX_ELEVATION, 
            this.settings.ELEVATION_MULTIPLIER,
            this.settings.SEED_MULTIPLIER,
            this.settings.NOISE_FLUCTUATION,
            this.settings.TEMP_RANGES
            );

        this.controller = new HexMapControllerClass(this.data);
    }

}