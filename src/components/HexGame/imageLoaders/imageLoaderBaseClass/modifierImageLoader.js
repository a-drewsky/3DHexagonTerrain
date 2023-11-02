import ImageLoaderUtilsClass from "../utils/imageLoaderUtils"

export default class ModifierSheetImageLoaderClass {

    constructor() {
        this.utils = new ImageLoaderUtilsClass()
    }

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

        this[imageName].src = image
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