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
            this.settings.ZOOM_AMOUNT,
            this.settings.HEXMAP_ELEVATION_RANGES,
            this.settings.ROTATION_AMOUNT,
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
            this.settings.SAND_HILL_ELVATION_DIVISOR,
            this.settings.MIRROR_MAP
        );

        if (this.settings.DEBUG) {
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
                this.settings.ZOOM_AMOUNT,
                this.settings.HEXMAP_ELEVATION_RANGES,
                this.settings.ROTATION_AMOUNT,
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

    build = (q, r, size) => {

        this.builder.build(q, r, size);

    }

    prerender = () => {
        this.view1.prerender()

        if (this.data2 !== undefined) {
            this.view2.prerender()
        }

    }

    update = (state) => {
        this.view.camera.position.x += this.view.camera.velocity.x * this.settings.CAMERA_SPEED
        this.view.camera.position.y += this.view.camera.velocity.y * this.settings.CAMERA_SPEED

        if (this.view.camera.position.x < 0 - this.view.canvas.width / 2) this.view.camera.position.x = 0 - this.view.canvas.width / 2
        if (this.view.camera.position.x > this.view.renderCanvasDims.width - this.view.canvas.width / 2) this.view.camera.position.x = this.view.renderCanvasDims.width - this.view.canvas.width / 2
        if (this.view.camera.position.y < 0 - this.view.canvas.height / 2) this.view.camera.position.y = 0 - this.view.canvas.height / 2
        if (this.view.camera.position.y > this.view.renderCanvasDims.height - this.view.canvas.height / 2) this.view.camera.position.y = this.view.renderCanvasDims.height - this.view.canvas.height / 2
    }

    draw = () => {
        this.view.draw();
    }

    clear = () => {
        this.view1.renderMap.clear();
        this.view2.renderMap.clear();
        this.view1.rotatedMap.clear();
        this.view2.rotatedMap.clear();
    }

    switchView = () => {
        if (!this.settings.DEBUG) return

        if (this.viewNum == 1) {
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