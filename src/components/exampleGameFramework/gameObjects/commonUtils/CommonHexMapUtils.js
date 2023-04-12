export default class CommonHexMapUtilsClass {

    //round floating hex coords to nearest integer hex coords
    roundToNearestHex = (q, r) => {
        let fracQ = q;
        let fracR = r;
        let fracS = -1 * q - r

        let roundQ = Math.round(fracQ);
        let roundR = Math.round(fracR);
        let roundS = Math.round(fracS);

        let diffQ = Math.abs(roundQ - fracQ);
        let diffR = Math.abs(roundR - fracR);
        let diffS = Math.abs(roundS - fracS);

        if (diffQ > diffR && diffQ > diffS) {
            roundQ = -1 * roundR - roundS
        } else if (diffR > diffS) {
            roundR = -1 * roundQ - roundS
        } else {
            roundS = -1 * roundQ - roundR
        }

        return {
            q: roundQ,
            r: roundR
        }

    }

    checkImagesLoaded = (spriteObject) => {
        if (!spriteObject.images || spriteObject.images.length == 0) return false
        return true
    }

    split = (key) => {
        let nums = key.split(',').map(Number);
        return {
            q: nums[0],
            r: nums[1]
        }
    }

    join = (q, r) => {
        return [q, r].join(',')
    }

    rotateTile = (q, r, rotation) => {
        let s = -q - r;
        let angle = rotation * 15;
        if (rotation % 2 == 1) angle -= 15;

        let newQ = q;
        let newR = r;
        let newS = s;

        for (let i = 0; i < angle; i += 30) {
            q = -newR;
            r = -newS;
            s = -newQ;

            newQ = q;
            newR = r;
            newS = s;
        }

        return {
            q: newQ,
            r: newR
        }
    }

}