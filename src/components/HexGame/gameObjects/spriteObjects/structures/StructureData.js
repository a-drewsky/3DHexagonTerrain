import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import BunkerClass from "./bunker/Bunker"
import FlagClass from "./flag/Flag"
import ModifierClass from "./modifier/Modifier"
import PropClass from "./prop/Prop"
import ResourceClass from "./resource/Resource"

export default class StructureDataClass {

    constructor(images) {
        this.images = images

        this.commonUtils = new CommonHexMapUtilsClass()

        this.structureMap = new Map()
    }

    setBunker = (pos, structureId) => {
        let newBunker = new BunkerClass(pos, structureId, this.images)
        this.structureMap.set(this.commonUtils.join(pos), newBunker)
        return newBunker
    }

    setFlag = (pos, structureId) => {
        let newFlag = new FlagClass(pos, structureId, this.images)
        this.structureMap.set(this.commonUtils.join(pos), newFlag)
        return newFlag
    }

    setModifier = (pos, structureId) => {
        let newModifier = new ModifierClass(pos, structureId, this.images)
        this.structureMap.set(this.commonUtils.join(pos), newModifier)
        return newModifier
    }

    setProp = (pos, structureId) => {
        let newProp = new PropClass(pos, structureId, this.images)
        this.structureMap.set(this.commonUtils.join(pos), newProp)
        return newProp
    }

    setResource = (pos, structureId) => {
        let newResource = new ResourceClass(pos, structureId, this.images)
        this.structureMap.set(this.commonUtils.join(pos), newResource)
        return newResource
    }

    destroyStructure = (structure) => {
        this.setModifier(structure.position, structure.destructionStructure)
    }

    getStructure = (pos) => {
        if(!this.hasStructure(pos)) return null
        return this.structureMap.get(this.commonUtils.join(pos))
    }

    hasStructure = (pos) => {
        return this.structureMap.has(this.commonUtils.join(pos))
    }

    getStructureMap = () => {
        return this.structureMap
    }

    getBunkersArray = () => {
        return Array.from(this.structureMap.values()).filter(structure => structure.type == 'bunker')
    }

    deleteStructure = (pos) => {
        if(this.hasStructure(pos)) this.structureMap.delete(this.commonUtils.join(pos))
    }

}