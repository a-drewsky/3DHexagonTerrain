import flat_woodlands_hex from '../images/tiles/flat_woodlands_hex.png'
import flat_desert_hex from '../images/tiles/flat_desert_hex.png'
import flat_water_hex from '../images/tiles/flat_water_hex.png'
import flat_frozenwater_hex from '../images/tiles/flat_frozenwater_hex.png'
import flat_playa_hex from '../images/tiles/flat_playa_hex.png'
import flat_tundra_hex from '../images/tiles/flat_tundra_hex.png'
import flat_savanna_hex from '../images/tiles/flat_savanna_hex.png'
import flat_sandhill_hex from '../images/tiles/flat_sandhill_hex.png'
import flat_grasshill_hex from '../images/tiles/flat_grasshill_hex.png'
import flat_snowhill_hex from '../images/tiles/flat_snowhill_hex.png'
import flat_rockhill_hex from '../images/tiles/flat_rockhill_hex.png'
import flat_savannahill_hex from '../images/tiles/flat_savannahill_hex.png'

export default class TileImagesClass {

    constructor() {

        this.images = {

            flat_snowmountain_hex: new Image(),
            flat_rockmountain_hex: new Image(),
            flat_snowhill_hex: new Image(),
            flat_grasshill_hex: new Image(),
            flat_savannahill_hex: new Image(),
            flat_sandhill_hex: new Image(),
            flat_woodlands_hex: new Image(),
            flat_savanna_hex: new Image(),
            flat_tundra_hex: new Image(),
            flat_desert_hex: new Image(),
            flat_water_hex: new Image(),
            flat_frozenwater_hex: new Image(),
            flat_playa_hex: new Image(),
        }

    }

    loadImages = (startGame) => {

        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.onload = () => {
                imagesLoaded++;
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images;
                    startGame();
                }
            }
        }


        this.flat_snowmountain_hex.src = flat_snowhill_hex;
        this.flat_rockmountain_hex.src = flat_rockhill_hex;
        this.flat_snowhill_hex.src = flat_snowhill_hex;
        this.flat_grasshill_hex.src = flat_grasshill_hex;
        this.flat_savannahill_hex.src = flat_savannahill_hex;
        this.flat_sandhill_hex.src = flat_sandhill_hex;
        this.flat_woodlands_hex.src = flat_woodlands_hex;
        this.flat_savanna_hex.src = flat_savanna_hex;
        this.flat_tundra_hex.src = flat_tundra_hex;
        this.flat_desert_hex.src = flat_desert_hex;
        this.flat_water_hex.src = flat_water_hex;
        this.flat_frozenwater_hex.src = flat_frozenwater_hex;
        this.flat_playa_hex.src = flat_playa_hex;


        this.snowmountain = [null, this.flat_snowmountain_hex, null, this.flat_snowmountain_hex, null, this.flat_snowmountain_hex, null, this.flat_snowmountain_hex, null, this.flat_snowmountain_hex, null, this.flat_snowmountain_hex]
        this.rockmountain = [null, this.flat_rockmountain_hex, null, this.flat_rockmountain_hex, null, this.flat_rockmountain_hex, null, this.flat_rockmountain_hex, null, this.flat_rockmountain_hex, null, this.flat_rockmountain_hex]
        this.snowhill =     [null, this.flat_snowhill_hex,     null, this.flat_snowhill_hex,     null, this.flat_snowhill_hex,     null, this.flat_snowhill_hex,     null, this.flat_snowhill_hex,     null, this.flat_snowhill_hex    ]
        this.grasshill =    [null, this.flat_grasshill_hex,    null, this.flat_grasshill_hex,    null, this.flat_grasshill_hex,    null, this.flat_grasshill_hex,    null, this.flat_grasshill_hex,    null, this.flat_grasshill_hex   ]
        this.savannahill =  [null, this.flat_savannahill_hex,  null, this.flat_savannahill_hex,  null, this.flat_savannahill_hex,  null, this.flat_savannahill_hex,  null, this.flat_savannahill_hex,  null, this.flat_savannahill_hex ]
        this.sandhill =     [null, this.flat_sandhill_hex,     null, this.flat_sandhill_hex,     null, this.flat_sandhill_hex,     null, this.flat_sandhill_hex,     null, this.flat_sandhill_hex,     null, this.flat_sandhill_hex    ]
        this.woodlands =    [null, this.flat_woodlands_hex,    null, this.flat_woodlands_hex,    null, this.flat_woodlands_hex,    null, this.flat_woodlands_hex,    null, this.flat_woodlands_hex,    null, this.flat_woodlands_hex   ]
        this.savanna =      [null, this.flat_savanna_hex,      null, this.flat_savanna_hex,      null, this.flat_savanna_hex,      null, this.flat_savanna_hex,      null, this.flat_savanna_hex,      null, this.flat_savanna_hex     ]
        this.tundra =       [null, this.flat_tundra_hex,       null, this.flat_tundra_hex,       null, this.flat_tundra_hex,       null, this.flat_tundra_hex,       null, this.flat_tundra_hex,       null, this.flat_tundra_hex      ]
        this.desert =       [null, this.flat_desert_hex,       null, this.flat_desert_hex,       null, this.flat_desert_hex,       null, this.flat_desert_hex,       null, this.flat_desert_hex,       null, this.flat_desert_hex      ]
        this.water =        [null, this.flat_water_hex,        null, this.flat_water_hex,        null, this.flat_water_hex,        null, this.flat_water_hex,        null, this.flat_water_hex,        null, this.flat_water_hex       ]
        this.frozenwater =  [null, this.flat_frozenwater_hex,  null, this.flat_frozenwater_hex,  null, this.flat_frozenwater_hex,  null, this.flat_frozenwater_hex,  null, this.flat_frozenwater_hex,  null, this.flat_frozenwater_hex ]
        this.playa =        [null, this.flat_playa_hex,        null, this.flat_playa_hex,        null, this.flat_playa_hex,        null, this.flat_playa_hex,        null, this.flat_playa_hex,        null, this.flat_playa_hex       ]

    }

}