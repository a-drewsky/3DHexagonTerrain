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

    getDistance = (pos1, pos2) => {
        return (Math.abs(pos1.q - pos2.q)
            + Math.abs(pos1.q + pos1.r - pos2.q - pos2.r)
            + Math.abs(pos1.r - pos2.r)) / 2
    }

    getClosestPos = (pos, posMap) => {
        let distMap = posMap.map(mapPos => mapPos === null ? Infinity : this.getDistance(pos, mapPos))

        let index = distMap.indexOf(Math.min(...distMap))
        return posMap[index]
    }

    getDirection = (pos1, pos2) => {
        let directionMap = [null, { q: 1, r: -1 }, null, { q: 1, r: 0 }, null, { q: 0, r: 1 }, null, { q: -1, r: 1 }, null, { q: -1, r: 0 }, null, { q: 0, r: -1 }]
        let rotatePosMap = directionMap.map(pos => pos === null ? null : { q: pos1.q - pos.q, r: pos1.r - pos.r })

        let closestPos
        if (rotatePosMap.findIndex(pos => pos !== null && pos.q == pos2.q && pos.r == pos2.r) != -1) {
            closestPos = pos2
        } else {
            closestPos = this.getClosestPos(pos2, rotatePosMap)
        }

        let direction = {
            q: closestPos.q - pos1.q,
            r: closestPos.r - pos1.r
        }

        return directionMap.findIndex(pos => pos != null && pos.q == direction.q && pos.r == direction.r)

    }

}