export default class CollisionClass {

   // POINT/RECTANGLE
   pointRect = (px, py, rx, ry, rw, rh) => {

      // is the point inside the rectangle's bounds?
      if (px >= rx &&        // right of the left edge AND
         px <= rx + rw &&   // left of the right edge AND
         py >= ry &&        // below the top AND
         py <= ry + rh) {   // above the bottom
         return true;
      }
      return false;
   }

   // POLYGON/POINT
   polyPoint = (vertices, px, py) => {
      let collision = false;

      // go through each of the vertices, plus
      // the next vertex in the list
      let next = 0;
      for (let current = 0; current < vertices.length; current++) {

         // get next vertex in list
         // if we've hit the end, wrap around to 0
         next = current + 1;
         if (next == vertices.length) next = 0;

         // get the PVectors at our current position
         // this makes our if statement a little cleaner
         let vc = vertices[current];    // c for "current"
         let vn = vertices[next];       // n for "next"

         // compare position, flip 'collision' variable
         // back and forth
         if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
            (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
            collision = !collision;
         }
      }
      return collision;
   }

   pointHex = (px, py, hx, hy, hsize, hsquish) => {

      let sideLength = Math.PI / 3;

      let hexPoints = []

      hexPoints.push({
         x: hx + Math.sin(sideLength * 0 - sideLength / 2) * hsize,
         y: hy + Math.cos(sideLength * 0 - sideLength / 2) * (hsize * hsquish)
      })
      hexPoints.push({
         x: hx + Math.sin(sideLength * 1 - sideLength / 2) * hsize,
         y: hy + Math.cos(sideLength * 1 - sideLength / 2) * (hsize * hsquish)
      })
      hexPoints.push({
         x: hx + Math.sin(sideLength * 2 - sideLength / 2) * hsize, 
         y: hy + Math.cos(sideLength * 2 - sideLength / 2) * (hsize * hsquish)
      })
      hexPoints.push({
         x: hx + Math.sin(sideLength * 3 - sideLength / 2) * hsize,
         y: hy + Math.cos(sideLength * 3 - sideLength / 2) * (hsize * hsquish)
      })
      hexPoints.push({
         x: hx + Math.sin(sideLength * 4 - sideLength / 2) * hsize,
         y: hy + Math.cos(sideLength * 4 - sideLength / 2) * (hsize * hsquish)
      })
      hexPoints.push({
         x: hx + Math.sin(sideLength * 5 - sideLength / 2) * hsize,
         y: hy + Math.cos(sideLength * 5 - sideLength / 2) * (hsize * hsquish)
      })

      let collision = this.polyPoint(hexPoints, px, py)

      return collision

   }

}