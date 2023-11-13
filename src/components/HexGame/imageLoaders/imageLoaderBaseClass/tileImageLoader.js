import ImageLoaderUtilsClass from "../utils/imageLoaderUtils"

export default class TileImageLoaderClass {

    constructor() {
        this.utils = new ImageLoaderUtilsClass()
    }

    loadImages = (startGame) => {

        this.images = []

        for (let imageName in this.image_data) {
            this.images[imageName] = new Image()
        }

        let imagesLoaded = 0
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value
            value.onload = () => {
                imagesLoaded++
                if (imagesLoaded === Object.keys(this.images).length) {
                    delete this.images
                    startGame()
                }
            }
        }

        for (let imageName in this.image_data) {

            let tempImage = new Image()

            tempImage.onload = () => {
                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = tempImage.width
                tempCanvas.height = tempImage.height
                let tempctx = tempCanvas.getContext('2d')
    
                tempctx.drawImage(tempImage, 0, 0, tempImage.width, tempImage.height)
    
                tempCanvas = this.utils.upscale(tempCanvas)

                let image = tempCanvas.toDataURL('image/png')
    
                this[imageName].src = image
            }

            tempImage.src = this.image_data[imageName]

        }


    }

}