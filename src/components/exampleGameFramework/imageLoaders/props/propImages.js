import LargeRockImagesClass from "./largeRockImages";
import SavannaTreeImagesClass from "./savannaTreeImages";

export default class PropImagesClass {

    constructor() {

        this.large_rock = new LargeRockImagesClass()
        this.savanna_tree = new SavannaTreeImagesClass()

    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if(totalLoaded == 2) startGame()
        }

        this.large_rock.loadImages(testLoaded)
        this.savanna_tree.loadImages(testLoaded)
        
    }

}