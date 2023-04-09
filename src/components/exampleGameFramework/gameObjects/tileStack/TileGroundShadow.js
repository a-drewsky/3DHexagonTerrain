export default class TileGroundShadowClass{

    constructor(pos, hexMapData){
        this.position = {
            q: pos.q,
            r: pos.r
        }
        this.height = null

        this.images = []

        this.groundShadowTile = true

        this.canvasSize = {
            width: hexMapData.size * 2,
            height: hexMapData.size * 2
         }
    }

}