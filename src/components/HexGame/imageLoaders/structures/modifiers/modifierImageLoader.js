export default class ModifierImageLoaderClass {

    loadImages = (startGame) => {

        this.createSheetImages()

        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.onload = () => {
                imagesLoaded++;
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images;
                    this.assignImages(startGame)
                }
            }
        }

        this.loadSheetImages()

    }

    createSheetImages = () => {

        this.images = {}

        for (let imageName in this.image_data) {
            this.images[imageName] = new Image()
        }

    }

    loadSheetImages = () => {

        for (let imageName in this.image_data) {
            this[imageName].src = this.image_data[imageName].sprite
        }
        
    }

    assignImages = (startGame) => {

        this.modifierImages = []

        for (let image in this.image_data) {
            this.modifierImages.push({
                image: this[image],
                shadow: this.image_data[image].shadow
            })
        }

        startGame();
    }

}