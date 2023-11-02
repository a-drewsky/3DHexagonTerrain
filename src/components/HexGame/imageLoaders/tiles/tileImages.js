import woodlands_tile from '../../images/tiles/woodlands_tile.png'
import desert_tile from '../../images/tiles/desert_tile.png'
import water_tile from '../../images/tiles/water_tile.png'
import frozenwater_tile from '../../images/tiles/frozenwater_tile.png'
import playa_tile from '../../images/tiles/playa_tile.png'
import tundra_tile from '../../images/tiles/tundra_tile.png'
import savanna_tile from '../../images/tiles/savanna_tile.png'
import sandhill_tile from '../../images/tiles/sandhill_tile.png'
import grasshill_tile from '../../images/tiles/grasshill_tile.png'
import snowhill_tile from '../../images/tiles/snowhill_tile.png'
import rockhill_tile from '../../images/tiles/rockhill_tile.png'
import savannahill_tile from '../../images/tiles/savannahill_tile.png'

import TileImageLoaderClass from '../imageLoaderBaseClass/tileImageLoader'

export default class TileImagesClass extends TileImageLoaderClass {

    constructor() {
        super()

        this.image_data = {

            snowmountain: snowhill_tile,
            rockmountain: rockhill_tile,
            snowhill: snowhill_tile,
            grasshill: grasshill_tile,
            savannahill: savannahill_tile,
            sandhill: sandhill_tile,
            woodlands: woodlands_tile,
            savanna: savanna_tile,
            tundra: tundra_tile,
            desert: desert_tile,
            water: water_tile,
            frozenwater: frozenwater_tile,
            playa: playa_tile,
        }

    }

}