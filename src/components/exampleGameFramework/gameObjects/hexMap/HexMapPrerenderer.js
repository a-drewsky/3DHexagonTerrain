export default class HexMapprerendererClass {

    constructor(hexMapData, tileManager, spriteManager) {

        this.hexMapData = hexMapData
        this.tileManager = tileManager
        this.spriteManager = spriteManager

        this.renderStack = []
    }

    prerender = () => {

        for (let [key, value] of this.tileManager.data.getFullMap()) {
            
            if (this.spriteManager.structures.data.hasStructure(value.position.q, value.position.r)) {
                let structure = this.spriteManager.structures.data.getStructure(value.position.q, value.position.r)
                structure.prerender = true
            }

            this.renderStack.push(value)
        }

    }

    update = () => {
        //check render stack
        if (this.renderStack.length == 0) return

        let tileToRender = this.renderStack.pop()
        if (tileToRender.groundShadowTile == false) {
            let tileObj = this.tileManager.data.getEntry(tileToRender.position.q, tileToRender.position.r)
            this.tileManager.renderer.renderTileStack(tileObj)
        } else {
            let tileObj = this.tileManager.data.getEntry(tileToRender.position.q, tileToRender.position.r)
            this.tileManager.renderer.renderGroundShadowTile(tileObj)
        }
        tileToRender.rendered = true

        //check for structures
        let neighborKeys = this.tileManager.data.getNeighborKeys(tileToRender.position.q, tileToRender.position.r)
        for(let neighborKey of neighborKeys){
            if(!this.tileManager.data.getEntry(neighborKey.q, neighborKey.r).rendered) continue
            if(!this.spriteManager.structures.data.hasStructure(neighborKey.q, neighborKey.r)) continue
            let structure = this.spriteManager.structures.data.getStructure(neighborKey.q, neighborKey.r)
            if (structure.type == 'modifier') this.spriteManager.structures.modifierRenderer.renderShadows(structure)
            else this.spriteManager.structures.structureRenderer.renderShadow(structure)
        }

        if (this.spriteManager.structures.data.hasStructure(tileToRender.position.q, tileToRender.position.r)) {
            let structure = this.spriteManager.structures.data.getStructure(tileToRender.position.q, tileToRender.position.r)
            if (structure.type == 'modifier') this.spriteManager.structures.modifierRenderer.renderAll(structure)
            else this.spriteManager.structures.structureRenderer.renderAll(structure)
            structure.render = false
            structure.prerender = false
        }

        if (this.renderStack.length == 0) console.log("done rendering")

    }

}