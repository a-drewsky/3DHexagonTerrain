export default class UnitImageLoaderClass {

    constructor(noRows) {
        this.noRows = noRows
    }

    loadImages = (startGame) => {

        this.createSheetImages()

        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.image.onload = () => {
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

        for (let sheetName in this.sheet_data) {

            let sprites = this.sheet_data[sheetName].sprites

            for (let col in sprites) {
                for (let row in this.rows) {
                    this.images[this.rows[row] + '_' + sprites[col]] = {
                        image: new Image(),
                        size: this.sheet_data[sheetName].size,
                        offset: this.sheet_data[sheetName].offset
                    }
                }
            }
        }

    }

    loadSheetImages = () => {

        for (let sheetName in this.sheet_data) {

            let sheet = new Image()

            sheet.onload = () => {
                this.loadSheet(sheet, sheetName)
            }
            sheet.src = this.sheet_data[sheetName].image
        }
    }

    loadSheet = (sheet, sheetName) => {    

        let spriteCount = Object.keys(this.sheet_data[sheetName].sprites).length
        let sprites = this.sheet_data[sheetName].sprites

        let imageDims = {
            width: sheet.width / spriteCount,
            height: sheet.height / 6
        }

        if(this.noRows) imageDims.height = sheet.height

        for (let col in sprites) {

            for (let row in this.rows) {

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = imageDims.width
                tempCanvas.height = imageDims.height
                let tempctx = tempCanvas.getContext('2d')

                if(this.noRows) tempctx.drawImage(sheet, imageDims.width * col, 0, imageDims.width, imageDims.height, 0, 0, imageDims.width, imageDims.height)
                else tempctx.drawImage(sheet, imageDims.width * col, imageDims.height * row, imageDims.width, imageDims.height, 0, 0, imageDims.width, imageDims.height)

                let image = tempCanvas.toDataURL('image/png');

                this[this.rows[row] + '_' + sprites[col]].image.src = image

            }
        }
    }

    assignImages = (startGame) => {

        for (let animation in this.animation_data) {

            let data = this.animation_data[animation]

            this[animation] = {
                images: []
            }

            for (let frame of data) {
                this[animation].images.push([this['backRight_' + frame], this['frontRight_' + frame], this['front_' + frame], this['frontLeft_' + frame], this['backLeft_' + frame], this['back_' + frame]])
            }
        }

        startGame();
    }

}