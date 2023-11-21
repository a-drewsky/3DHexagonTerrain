
import { PRERENDER_STACKS_PER_FRAME } from "./HexMapConstants"

export default class HexMapPrerendererClass {

    constructor(hexMapData, tileManager, spriteManager) {

        this.tileData = hexMapData.tileData
        this.structureData = hexMapData.structureData
        this.tileRenderer = tileManager.renderer
        this.structureRenderer = spriteManager.structures.structureRenderer
        this.modifierRenderer = spriteManager.structures.modifierRenderer

        this.renderStack = []
    }

    prerender = () => {

        for (let [key, value] of this.tileData.getFullMap()) {
            
            if (this.structureData.hasStructure(value.position)) {
                let structure = this.structureData.getStructure(value.position)
                structure.prerender = true
            }

            this.renderStack.push(value)
        }

    }

    update = () => {
        if (this.renderStack.length === 0) return

        for(let i=0; i<PRERENDER_STACKS_PER_FRAME; i++){
            let tileToRender = this.renderStack.pop()
            this.renderTileStack(tileToRender)
            this.renderStructures(tileToRender)
        }

        if (this.renderStack.length === 0) console.log("done rendering")

    }

    renderTileStack = (tileObj) => {
        if (tileObj.groundShadowTile === false) {
            this.tileRenderer.renderTileStack(tileObj)
        } else {
            this.tileRenderer.renderGroundShadowTile(tileObj)
        }
        tileObj.rendered = true
    }

    renderStructures = (tileObj) => {

        if (this.structureData.hasStructure(tileObj.position)) {
            let structure = this.structureData.getStructure(tileObj.position)
            if (structure.spriteType === 'modifier'){
                this.modifierRenderer.renderAll(structure)
            } else {
                this.structureRenderer.renderAll(structure)
            } 
            structure.render = false
            structure.prerender = false
        }
        
        let neighborKeys = this.tileData.getNeighborKeys(tileObj.position, 1)
        for(let neighborKey of neighborKeys){
            if(!this.tileData.getAnyEntry(neighborKey).rendered) continue
            if(!this.structureData.hasStructure(neighborKey)) continue

            let structure = this.structureData.getStructure(neighborKey)
            if (structure.spriteType === 'modifier') this.modifierRenderer.renderShadows(structure)
            else this.structureRenderer.renderShadow(structure)
        }
        
    }

}