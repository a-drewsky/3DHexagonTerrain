import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapSettingsClass from "./HexMapSettings"

export default class HexMapClass {

    constructor(ctx, canvas, camera, images) {

        this.settings = new HexMapSettingsClass()

        this.data1 = new HexMapDataClass(this.settings, canvas);

        this.data = this.data1

        this.view1 = new HexMapViewClass(ctx, canvas, camera, this.data1, this.settings, images);

        this.view = this.view1

        this.builder = new HexMapBuilderClass(this.data1, this.settings);

        if (this.settings.DEBUG) {
            this.data2 = new HexMapDataClass(this.settings, canvas);

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
        this.view.update();
    }

    draw = () => {
        this.view.draw();
    }

    clear = () => {
        this.view1.renderMap.clear();
        if(this.view2) this.view2.renderMap.clear();
        this.view1.rotatedMap.clear();
        if(this.view2) this.view2.rotatedMap.clear();
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