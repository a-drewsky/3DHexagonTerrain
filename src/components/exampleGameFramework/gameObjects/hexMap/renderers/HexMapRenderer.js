import HexMapRendererMapClass from "./HexMapRendererMap";
import HexMapRendererSelectionsClass from "./HexMapRendererSelection";
import HexMapRendererTableClass from "./HexMapRendererTable";

export default class HexMapRendererClass {

    constructor(hexMapData, spriteManager, camera, settings, images) {
        this.mapRenderer = new HexMapRendererMapClass(hexMapData, camera, settings, images)
        this.selectionRenderer = new HexMapRendererSelectionsClass(hexMapData, camera, settings, images)
        this.tableRenderer = new HexMapRendererTableClass(hexMapData, camera, settings)

        this.hexMapData = hexMapData
        this.spriteManager = spriteManager

        this.renderStack = []
    }

    prerender = (drawCanvas) => {

        this.mapRenderer.prerender(drawCanvas);
        this.tableRenderer.prerender(drawCanvas);

        for (let [key, value] of this.hexMapData.getFullMap()) {
            this.renderStack.push(value)
        }

    }

    update = () => {
        //check render stack
        if (this.renderStack.length > 0) {
            let tileToRender = this.renderStack.pop()
            console.log(tileToRender)
            if (tileToRender.groundShadowTile == false) {
                let tileObj = this.hexMapData.getEntry(tileToRender.position.q, tileToRender.position.r)
                this.mapRenderer.renderTileStack(tileObj)
            } else {
                let tileObj = this.hexMapData.getEntry(tileToRender.position.q, tileToRender.position.r)
                this.mapRenderer.renderGroundShadowTile(tileObj)
            }

            if (this.spriteManager.structures.hasStructure(tileToRender.position.q, tileToRender.position.r)) {
                this.spriteManager.structures.getStructure(tileToRender.position.q, tileToRender.position.r).renderer.render()
            }

            if (this.renderStack.length == 0) console.log("done rendering")
        }
    }

}