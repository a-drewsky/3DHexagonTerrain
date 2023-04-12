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

    setBunker = (q, r, structureName) => {
        let newBunker = new BunkerClass({q: q, r: r}, structureName, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newBunker)
        return newBunker
    }

    setFlag = (q, r, structureName) => {
        let newFlag = new FlagClass({q: q, r: r}, structureName, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newFlag)
        return newFlag
    }

    setModifier = (q, r, structureName) => {
        let newModifier = new ModifierClass({q: q, r: r}, structureName, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newModifier)
        return newModifier
    }

    setProp = (q, r, structureName) => {
        let newProp = new PropClass({q: q, r: r}, structureName, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newProp)
        return newProp
    }

    setResource = (q, r, structureName) => {
        let newResource = new ResourceClass({q: q, r: r}, structureName, this.hexMapData, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newResource)
        return newResource
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

    deleteStructure = (q, r) => {
        if(this.hasStructure(q, r)) this.structureMap.delete(this.commonUtils.join(q, r))
    }

}