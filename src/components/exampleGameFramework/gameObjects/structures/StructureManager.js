import HexMapCommonUtilsClass from "../commonUtils/HexMapCommonUtils"
import BunkerClass from "./bunker/Bunker"
import FlagClass from "./flag/Flag"
import ModifierClass from "./modifier/Modifier"
import PropClass from "./prop/Prop"
import ResourceClass from "./resource/Resource"

export default class StructureManagerClass {

    constructor(hexMapData, tileManager, camera, images, settings) {
        this.hexMapData = hexMapData
        this.tileManager = tileManager
        this.camera = camera
        this.images = images
        this.settings = settings

        this.commonUtils = new HexMapCommonUtilsClass()

        this.structureMap = new Map()
    }

    // setStructure = (q, r, terrain) => {
    //     this.structureMap.set(this.commonUtils.join(q, r), terrain)
    // }

    setBunker = (q, r, structureName) => {
        let newBunker = new BunkerClass({q: q, r: r}, structureName, this.hexMapData, this.tileManager, this.camera, this.settings, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newBunker)
        return newBunker
    }

    setFlag = (q, r, structureName) => {
        let newFlag = new FlagClass({q: q, r: r}, structureName, this.hexMapData, this.tileManager, this.camera, this.settings, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newFlag)
        return newFlag
    }

    setModifier = (q, r, structureName) => {
        let newModifier = new ModifierClass({q: q, r: r}, structureName, this.hexMapData, this.tileManager, this.camera, this.settings, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newModifier)
        return newModifier
    }

    setProp = (q, r, structureName) => {
        let newProp = new PropClass({q: q, r: r}, structureName, this.hexMapData, this.tileManager, this.camera, this.settings, this.images)
        this.structureMap.set(this.commonUtils.join(q, r), newProp)
        return newProp
    }

    setResource = (q, r, structureName) => {
        let newResource = new ResourceClass({q: q, r: r}, structureName, this.hexMapData, this.tileManager, this.camera, this.settings, this.images)
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