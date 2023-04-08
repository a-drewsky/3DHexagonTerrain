import HexMapRendererTableClass from "./HexMapRendererTable";

export default class HexMapRendererClass {

    constructor(hexMapData, spriteManager, camera, settings, images) {
        this.tableRenderer = new HexMapRendererTableClass(hexMapData, spriteManager, camera, settings)

        this.hexMapData = hexMapData
        this.spriteManager = spriteManager

        this.renderStack = []
    }

    prerender = (drawCanvas) => {

        this.tableRenderer.prerender(drawCanvas);

        this.spriteManager.tiles.data.setMapPos(drawCanvas);

        for (let [key, value] of this.spriteManager.tiles.data.getFullMap()) {
            this.renderStack.push(value)
        }

    }

    update = () => {
        //check render stack
        if (this.renderStack.length > 0) {
            let tileToRender = this.renderStack.pop()
            if (tileToRender.groundShadowTile == false) {
                let tileObj = this.spriteManager.tiles.data.getEntry(tileToRender.position.q, tileToRender.position.r)
                this.spriteManager.tiles.renderer.renderTileStack(tileObj)
            } else {
                let tileObj = this.spriteManager.tiles.data.getEntry(tileToRender.position.q, tileToRender.position.r)
                this.spriteManager.tiles.renderer.renderGroundShadowTile(tileObj)
            }

            if (this.spriteManager.structures.hasStructure(tileToRender.position.q, tileToRender.position.r)) {
                this.spriteManager.structures.getStructure(tileToRender.position.q, tileToRender.position.r).renderer.render()
            }

            if (this.renderStack.length == 0) console.log("done rendering")
        }
    }

}