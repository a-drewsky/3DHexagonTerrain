export default class tileImagesClass {

    constructor(){

        this.images = {

        }

    }

    loadImages = (next, startGame) => {

        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.onload = () => {
                imagesLoaded++;
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images;
                    next(startGame);
                }
            }
        }
    }

}