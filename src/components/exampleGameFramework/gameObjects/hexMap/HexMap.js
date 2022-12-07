import HexMapDataClass from "./HexMapData"
import HexMapBuilderClass from "./HexMapBuilder"
import HexMapControllerClass from "./HexMapController"
import HexMapViewClass from "./HexMapView"
import HexMapSettingsClass from "./HexMapSettings"

import HexMapPathFinderClass from "./HexMapPathFinder"

export default class HexMapClass {

    constructor(ctx, canvas, camera, images, settings) {

        this.settings = new HexMapSettingsClass(settings)

        this.data = new HexMapDataClass(this.settings, canvas);

        this.view = new HexMapViewClass(ctx, canvas, camera, this.data, this.settings, images);

        this.builder = new HexMapBuilderClass(this.data, this.settings);

        this.controller = new HexMapControllerClass(this.data, camera, canvas);
        
        this.pathFinder = new HexMapPathFinderClass(this.data, camera)
    }

    build = (q, r, size) => {
        this.builder.build(q, r, size);
    }

    prerender = () => {
        this.view.prerender()

    }

    update = (state) => {
        this.view.update();
    }

    draw = () => {
        this.view.draw();
    }

    clear = () => {
        this.view.renderMap.clear();
        this.view.rotatedMap.clear();
    }

    findPath = () => {

        if(!this.data.getValues().some(tile => tile.selected == true)) return
        
        let target = this.data.getValues().find(tile => tile.selected == true).originalPos
        let start = {
            q: -7,
            r: 28
        }

        let path = this.pathFinder.findPath(start, target)

        if(!path) return

        for(let tileObj of path){
            let tile = this.data.getEntry(tileObj.tile.q, tileObj.tile.r)
            tile.selected = true
            tile.test = tileObj.gCost + ' : ' + tileObj.hCost
            this.data.setEntry(tileObj.tile.q, tileObj.tile.r, tile)
        }

    }

}