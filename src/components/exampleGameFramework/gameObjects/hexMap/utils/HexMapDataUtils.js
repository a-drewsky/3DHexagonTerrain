export default class HexMapDataUtilsClass {

    // //converts key string to key object (returns a key object)
    // split = (key) => {
    //     let nums = key.split(',').map(Number);
    //     return {
    //         q: nums[0],
    //         r: nums[1]
    //     }
    // }

    // //converts a key object to a key string (returns a key string)
    // join = (q, r) => {
    //     return [q, r].join(',')
    // }

    // rotateTile = (q, r, rotation) => {
    //     let s = -q - r;
    //     let angle = rotation * 15;
    //     if (rotation % 2 == 1) angle -= 15;

    //     let newQ = q;
    //     let newR = r;
    //     let newS = s;

    //     for (let i = 0; i < angle; i += 30) {
    //         q = -newR;
    //         r = -newS;
    //         s = -newQ;

    //         newQ = q;
    //         newR = r;
    //         newS = s;
    //     }

    //     return {
    //         q: newQ,
    //         r: newR
    //     }
    // }

}