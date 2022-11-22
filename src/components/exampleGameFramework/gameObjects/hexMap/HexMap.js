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
            this.settings.TILE_SIZE,
            this.settings.HEXMAP_SQUISH,
            this.settings.TILE_HEIGHT,
            this.settings.SHADOW_ROTATION
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
            this.settings.HEXMAP_COLORS,
            this.settings.HEXMAP_SIDE_COLOR_MULTIPLIER,
            this.settings.HEXMAP_ELEVATION_RANGES,
            this.settings.MODIFIER_SECOND_SPRITE_CHANCE,
            this.settings.MODIFIER_SECOND_SPRITE_CHANCE_INCREMENT,
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
            this.settings.MIRROR_MAP,
            this.settings.TERRAIN_GENERATION_THERSHOLD,
            this.settings.TERRAIN_GENERATION_MAX_NEIGHBORS,
            this.settings.TERRAIN_ROCK_GEN_THRESHOLD,
            this.settings.CELL_SIZE,
            this.settings.BUFFER_SIZES,
            this.settings.SECOND_MINE_CHANCE,
            this.settings.THIRD_MINE_CHACE
        );

        if (this.settings.DEBUG) {
            this.data2 = new HexMapDataClass(
                this.settings.TILE_SIZE,
                this.settings.HEXMAP_SQUISH,
                this.settings.TILE_HEIGHT,
                this.settings.SHADOW_ROTATION
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
                this.settings.HEXMAP_COLORS,
                this.settings.HEXMAP_SIDE_COLOR_MULTIPLIER,
                this.settings.HEXMAP_ELEVATION_RANGES,
                this.settings.MODIFIER_SECOND_SPRITE_CHANCE,
                this.settings.MODIFIER_SECOND_SPRITE_CHANCE_INCREMENT,
                this.settings.DEBUG,
                this.settings.GEOMTRIC_TILES_DEBUG,
                images
            );

            this.builder.hexMapData2 = this.data2
            this.builder.hexMapView2 = this.view2
            this.viewNum = 1
        }


        this.controller = new HexMapControllerClass(this.data, camera);
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
        let zoom = this.view.camera.zoom * this.view.camera.zoomAmount
        if (this.view.camera.position.x + zoom/2 < 0 - this.view.canvas.width / 2) this.view.camera.position.x = 0 - this.view.canvas.width / 2 - zoom/2
        if (this.view.camera.position.x + zoom/2 > this.view.drawCanvas.width - this.view.canvas.width / 2) this.view.camera.position.x = this.view.drawCanvas.width - this.view.canvas.width / 2  - zoom/2
        if (this.view.camera.position.y + zoom/2*this.data.squish < 0 - this.view.canvas.height / 2) this.view.camera.position.y = 0 - this.view.canvas.height / 2 - zoom/2*this.data.squish
        if (this.view.camera.position.y + zoom/2*this.data.squish > this.view.drawCanvas.height - this.view.canvas.height / 2) this.view.camera.position.y = this.view.drawCanvas.height - this.view.canvas.height / 2 - zoom/2*this.data.squish
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