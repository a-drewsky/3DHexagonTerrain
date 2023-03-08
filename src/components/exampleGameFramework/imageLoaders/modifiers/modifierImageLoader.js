export default class ModifierImageLoaderClass {

    constructor(shadow_sheet_list) {
        this.shadow_sheet_list = shadow_sheet_list
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

        if (this.images === undefined) this.images = {}

        for (let sheet in this.shadow_sheet_list) {
            for (let row in this.rows) {
                this.images[this.rows[row] + '_' + sheet] = new Image()
            }

        }

        for (let imageName in this.image_data) {
            console.log(imageName)
            this.images[imageName] = new Image()
        }

    }

    loadSheetImages = () => {

        for (let sheetName in this.shadow_sheet_list) {

            let sheet = new Image()

            sheet.onload = () => {
                let imageDims = {
                    width: sheet.width,
                    height: sheet.height / 6
                }

                for (let row in this.rows) {

                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = imageDims.width
                    tempCanvas.height = imageDims.height
                    let tempctx = tempCanvas.getContext('2d')

                    tempctx.drawImage(sheet, 0, imageDims.height * row, imageDims.width, imageDims.height, 0, 0, imageDims.width, imageDims.height)

                    let image = tempCanvas.toDataURL('image/png');

                    this[this.rows[row] + '_' + sheetName].src = image

                }
            }
            sheet.src = this.shadow_sheet_list[sheetName]
        }

        for (let imageName in this.image_data) {
            console.log(imageName)
            this[imageName].src = this.image_data[imageName].sprite

        }
    }

    assignImages = (startGame) => {

        if (this.modifierImages === undefined) this.modifierImages = []

        if (this.shadowImages === undefined) this.shadowImages = []

        for (let image in this.image_data) {

            let data = this.image_data[image]

            this.modifierImages.push(this[image])

            if(data.shadow !== null) this.shadowImages.push([null, this['backRight_' + data.shadow], null, this['frontRight_' + data.shadow], null, this['front_' + data.shadow], null, this['frontLeft_' + data.shadow], null, this['backLeft_' + data.shadow], null, this['back_' + data.shadow]])
            else this.shadowImages.push([null, null, null, null, null, null, null, null, null, null, null, null])
        }

        startGame();
    }

}