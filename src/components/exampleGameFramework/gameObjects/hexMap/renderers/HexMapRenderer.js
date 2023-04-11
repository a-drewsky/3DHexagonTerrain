import HexMapRendererTableClass from "./HexMapRendererTable";

export default class HexMapRendererClass {

    constructor(hexMapData, tileManager, spriteManager, camera, settings) {
        this.tableRenderer = new HexMapRendererTableClass(hexMapData, tileManager, camera, settings)

        this.hexMapData = hexMapData
        this.tileManager = tileManager
        this.spriteManager = spriteManager

        this.renderStack = []
    }

    prerender = (drawCanvas) => {

        this.tableRenderer.prerender(drawCanvas);

        this.tileManager.data.setMapPos(drawCanvas);

        for (let [key, value] of this.tileManager.data.getFullMap()) {
            this.renderStack.push(value)
        }

    }

    update = () => {
        //check render stack
        if (this.renderStack.length > 0) {
            let tileToRender = this.renderStack.pop()
            if (tileToRender.groundShadowTile == false) {
                let tileObj = this.tileManager.data.getEntry(tileToRender.position.q, tileToRender.position.r)
                this.tileManager.renderer.renderTileStack(tileObj)
            } else {
                let tileObj = this.tileManager.data.getEntry(tileToRender.position.q, tileToRender.position.r)
                this.tileManager.renderer.renderGroundShadowTile(tileObj)
            }

            if (this.spriteManager.structures.data.hasStructure(tileToRender.position.q, tileToRender.position.r)) {
                let structure = this.spriteManager.structures.data.getStructure(tileToRender.position.q, tileToRender.position.r)
                if(structure.type == 'modifier') this.spriteManager.structures.modifierRenderer.render(structure)
                else this.spriteManager.structures.structureRenderer.render(structure)
                
            }

            if (this.renderStack.length == 0) console.log("done rendering")
        }
    }

}