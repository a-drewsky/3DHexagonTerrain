import CommonHexMapUtilsClass from "../../commonUtils/CommonHexMapUtils"
import BunkerClass from "./bunker/Bunker"
import FlagClass from "./flag/Flag"
import ModifierClass from "./modifier/Modifier"
import PropClass from "./prop/Prop"
import ResourceClass from "./resource/Resource"

export default class StructureDataClass {

    constructor(hexMapData, images) {
        this.hexMapData = hexMapData
        this.images = images

        this.commonUtils = new CommonHexMapUtilsClass()

        this.structureMap = new Map()
    }

    setBunker = (q, r, structureId) => {
        let newBunker = new BunkerClass({q: q, r: r}, structureId, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newBunker)
        return newBunker
    }

    setFlag = (q, r, structureId) => {
        let newFlag = new FlagClass({q: q, r: r}, structureId, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newFlag)
        return newFlag
    }

    setModifier = (q, r, structureId) => {
        let newModifier = new ModifierClass({q: q, r: r}, structureId, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newModifier)
        return newModifier
    }

    setProp = (q, r, structureId) => {
        let newProp = new PropClass({q: q, r: r}, structureId, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newProp)
        return newProp
    }

    setResource = (q, r, structureId) => {
        let newResource = new ResourceClass({q: q, r: r}, structureId, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newResource)
        return newResource
    }

    destroyStructure = (structure) => {
        this.setModifier(structure.position.q, structure.position.r, structure.destructionStructure)
    }

    getStructure = (q, r) => {
        if(!this.hasStructure(q, r)) return null
        return this.structureMap.get(this.commonUtils.join(q, r))
    }

    hasStructure = (q, r) => {
        return this.structureMap.has(this.commonUtils.join(q, r))
    }

    getStructureMap = () => {
        return this.structureMap
    }

    getBunkersArray = () => {
        return Array.from(this.structureMap.values()).filter(structure => structure.type == 'bunker')
    }

    deleteStructure = (q, r) => {
        if(this.hasStructure(q, r)) this.structureMap.delete(this.commonUtils.join(q, r))
    }

}