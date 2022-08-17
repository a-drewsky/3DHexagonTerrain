
import exampleImage from './images/example_hex_500.png'

export default class ImagesClass {

    constructor() {
        this.images = {
            exampleImage: new Image()
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

        //Assign images
        this.exampleImage.src = exampleImage;

    }

}