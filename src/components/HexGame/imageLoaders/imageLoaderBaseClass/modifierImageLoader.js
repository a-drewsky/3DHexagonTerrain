import ImageLoaderUtilsClass from "../utils/imageLoaderUtils"

export default class ModifierImageLoaderClass {

    constructor() {
        this.utils = new ImageLoaderUtilsClass()
    }

    loadImages = (startGame) => {

        this.createSheetImages()

        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.sprite.onload = () => {
                imagesLoaded++;
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images
                    startGame()
                }
            }
        }

        this.loadSheetImages()

    }

    createSheetImages = () => {

        this.images = {}

        for (let imageName in this.image_data) {
            this.images[imageName] = {
                sprite: new Image(),
                shadow: this.image_data[imageName].shadow
            }

        }
    }

    loadSheetImages = () => {

        for (let imageName in this.image_data) {

            let tempImage = new Image()

            tempImage.onload = () => {
                this.loadSheet(tempImage, imageName)
            }
            tempImage.src = this.image_data[imageName].sprite

        }

    }

    loadSheet = (spriteImage, imageName) => {
        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = spriteImage.width
        tempCanvas.height = spriteImage.height
        let tempctx = tempCanvas.getContext('2d')

        tempctx.drawImage(spriteImage, 0, 0, tempCanvas.width, tempCanvas.height)

        tempCanvas = this.utils.upscale(tempCanvas)

        let image = tempCanvas.toDataURL('image/png');

        this[imageName].sprite.src = image
    }

}