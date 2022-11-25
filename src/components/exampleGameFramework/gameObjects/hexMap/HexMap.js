import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapSettingsClass from "./HexMapSettings"

export default class HexMapClass {

    constructor(ctx, canvas, camera, images) {

        this.settings = new HexMapSettingsClass()

        this.data1 = new HexMapDataClass(this.settings);

        this.data = this.data1

        this.view1 = new HexMapViewClass(ctx, canvas, camera, this.data1, this.settings, images);

        this.view = this.view1

        this.builder = new HexMapBuilderClass(this.data1, this.settings);

        if (this.settings.DEBUG) {
            this.data2 = new HexMapDataClass(this.settings);

            this.view2 = new HexMapViewClass(ctx, canvas, camera, this.data2, this.settings, images);

            this.builder.hexMapData2 = this.data2
            this.viewNum = 1
        }

        this.controller = new HexMapControllerClass(this.data, camera, canvas);
        
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