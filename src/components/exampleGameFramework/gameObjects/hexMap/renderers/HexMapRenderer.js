import HexMapRendererMapClass from "./HexMapRendererMap";
import HexMapRendererSpritesClass from "./sprites/HexMapRendererSprites";
import HexMapRendererSelectionsClass from "./HexMapRendererSelection";
import HexMapRendererTableClass from "./HexMapRendererTable";

export default class HexMapRendererClass {

    constructor(hexMapData, camera, settings, images) {
        this.mapRenderer = new HexMapRendererMapClass(hexMapData, camera, settings, images)
        this.spriteRenderer = new HexMapRendererSpritesClass(hexMapData, camera, settings, images)
        this.selectionRenderer = new HexMapRendererSelectionsClass(hexMapData, camera, settings, images)
        this.tableRenderer = new HexMapRendererTableClass(hexMapData, camera, settings, images)

        this.hexMapData = hexMapData

        this.renderStack = []
    }

    prerender = (drawCanvas) => {

        this.mapRenderer.prerender(drawCanvas);
        this.tableRenderer.prerender(drawCanvas);

        for (let [key, value] of this.hexMapData.getMap()) {
            this.renderStack.push(value.position)
        }

    }

    update = () => {
        //check render stack
        if (this.renderStack.length > 0) {
            let tileToRender = this.renderStack.pop()

            let tileObj = this.hexMapData.getEntry(tileToRender.q, tileToRender.r)
            this.mapRenderer.renderTileStack(tileObj)

            let terrainObj = this.hexMapData.getTerrain(tileToRender.q, tileToRender.r)

            if (terrainObj !== null) {
                this.spriteRenderer.prerenderTerrain(terrainObj);
            }

            if (this.renderStack.length == 0) console.log("done rendering")
        }
    }

}