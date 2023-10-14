export default class TileShadowImageLoaderClass {

    loadImages = (startGame) => {

        this.createSheetImages()

        let imagesLoaded = 0
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value
            value.onload = () => {
                imagesLoaded++
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images
                    this.assignImages(startGame)
                }
            }
        }

        this.loadSheetImages()

    }

    assignImages = (startGame) => {


        this.tile_side_shadows = [this['backRight_side_shadow'], this['frontRight_side_shadow'], this['front_side_shadow'], this['frontLeft_side_shadow'], this['backLeft_side_shadow'], this['back_side_shadow']]
        this.casted_shadows = {}

        for (let permutationNum in this.shadow_permutations) {
            let permutation = this.shadow_permutations[permutationNum]
            this.casted_shadows['l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r] = [
                this['backRight' + '_l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r], 
                this['frontRight' + '_l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r], 
                this['front' + '_l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r], 
                this['frontLeft' + '_l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r], 
                this['backLeft' + '_l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r], 
                this['back' + '_l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r]
            ]
        }

        startGame()

    }

    createSheetImages = () => {

        this.images = {}

        for (let row in this.rows) {
            this.images[this.rows[row] + '_side_shadow'] = new Image()

            for (let permutationNum in this.shadow_permutations) {
                let permutation = this.shadow_permutations[permutationNum]
                
                this.images[this.rows[row] + '_l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r] = new Image()
            }
        }

    }

    loadSheetImages = () => {

        let side_shadows_sheet = new Image()
        side_shadows_sheet.onload = () => {
            this.loadSideShadowSheet(side_shadows_sheet)
        }
        side_shadows_sheet.src = this.tile_side_shadows

        let shadows_sheet = new Image()
        shadows_sheet.onload = () => {
            this.loadShadowSheet(shadows_sheet)
        }
        shadows_sheet.src = this.tile_shadows

    }

    loadShadowSheet = (shadows_sheet) => {

        let imageDims = {
            width: shadows_sheet.width / 18,
            height: shadows_sheet.height / 6
        }

        for (let rowNum in this.rows) {

            for (let permutationNum in this.shadow_permutations) {
                let permutation = this.shadow_permutations[permutationNum]

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = imageDims.width
                tempCanvas.height = imageDims.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(shadows_sheet, imageDims.width * permutationNum, imageDims.height * rowNum, imageDims.width, imageDims.height, 0, 0, imageDims.width, imageDims.height)

                let image = tempCanvas.toDataURL('image/png');

                this[this.rows[rowNum] + '_l' + permutation.l + '_c' + permutation.c + '_r' + permutation.r].src = image

            }

        }

    }

    loadSideShadowSheet = (side_shadows_sheet) => {

        let imageDims = {
            width: side_shadows_sheet.width,
            height: side_shadows_sheet.height / 6
        }

        for (let rowNum in this.rows) {

            let tempCanvas = document.createElement('canvas')
            tempCanvas.width = imageDims.width
            tempCanvas.height = imageDims.height
            let tempctx = tempCanvas.getContext('2d')

            tempctx.drawImage(side_shadows_sheet, 0, imageDims.height * rowNum, imageDims.width, imageDims.height, 0, 0, imageDims.width, imageDims.height)

            let image = tempCanvas.toDataURL('image/png');

            this[this.rows[rowNum] + '_side_shadow'].src = image

        }

    }

}