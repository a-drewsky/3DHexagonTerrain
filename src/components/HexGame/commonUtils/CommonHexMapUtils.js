export default class CommonHexMapUtilsClass {

    //round floating hex coords to nearest integer hex coords
    roundToNearestHex = (key) => {
        let fracQ = key.q;
        let fracR = key.r;
        let fracS = -1 * key.q - key.r

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
        if (!spriteObject.images || spriteObject.images.length === 0) return false
        return true
    }

    checkShadowImages = (spriteObject) => {
        if (!spriteObject.shadowImages && !spriteObject.shadowImage) return false
        if (spriteObject.shadowImages && spriteObject.shadowImages.length === 0) return false
        return true
    }

    checkStateImages = (spriteObject) => {
        if(spriteObject.imageObject[spriteObject.curState()]) return true
        return false
    }

    split = (key) => {
        let nums = key.split(',').map(Number);
        return {
            q: nums[0],
            r: nums[1]
        }
    }

    join = (key) => {
        return [key.q, key.r].join(',')
    }

    rotateTile = (key, rotation) => {
        let q = key.q
        let r = key.r
        let s = -q - r;
        let angle = rotation * 30;

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

    //not the same as roundToNearestHex
    getClosestPos = (pos, posMap) => {
        let distMap = posMap.map(mapPos => this.getDistance(pos, mapPos))

        let index = distMap.indexOf(Math.min(...distMap))
        return posMap[index]
    }

    getClosestPosIndex = (pos, posMap) => {
        let distMap = posMap.map(mapPos => this.getDistance(pos, mapPos))

        let index = distMap.indexOf(Math.min(...distMap))
        return index
    }

    getDirection = (pos1, pos2) => {
        let directionMap = [{ q: 1, r: -1 }, { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 }, { q: -1, r: 0 }, { q: 0, r: -1 }]
        let rotatePosMap = directionMap.map(pos => { return { q: pos1.q - pos.q, r: pos1.r - pos.r } })

        let closestPos
        if (rotatePosMap.findIndex(pos => pos.q === pos2.q && pos.r === pos2.r) !== -1) {
            closestPos = pos2
        } else {
            closestPos = this.getClosestPos(pos2, rotatePosMap)
        }

        let direction = {
            q: closestPos.q - pos1.q,
            r: closestPos.r - pos1.r
        }

        return directionMap.findIndex(pos => pos.q === direction.q && pos.r === direction.r)

    }

    getAdjacentPos = (pos, rotation) => {
        let directionMap = [{ q: 1, r: -1 }, { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 }, { q: -1, r: 0 }, { q: 0, r: -1 }]
        
        let direction = directionMap[rotation]

        if(direction === null) return null

        return { q: pos.q + direction.q, r: pos.r + direction.r}

    }

    getAdjacentHalfPos = (pos, rotation) => {
        let directionMap = [{ q: 0.49, r: -0.49 }, { q: 0.49, r: 0 }, { q: 0, r: 0.49 }, { q: -0.49, r: 0.49 }, { q: -0.49, r: 0 }, { q: 0, r: -0.49 }]
        
        let direction = directionMap[rotation]

        if(direction === null) return null

        return { q: pos.q + direction.q, r: pos.r + direction.r}

    }

    getLerpPos = (startTile, targetTile, percent) => {
        return {
            q: startTile.q + (targetTile.q - startTile.q) * percent,
            r: startTile.r + (targetTile.r - startTile.r) * percent
        }
    }

    tilesEqual = (tile1, tile2) => {
        if(tile1.q !== tile2.q) return false
        if(tile1.r !== tile2.r) return false
        return true 
    }

}