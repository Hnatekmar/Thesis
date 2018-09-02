// import * as PolyK from 'polyk'
// import * as _ from 'lodash'
import * as p2 from 'p2'
export class Sensor {
  constructor (endPoint, world) {
    this.endPoint = endPoint
    this.world = world
    this.shortest = null
  }
  cast (origin, ignoredIDs, rotation) {
    this.rotatedEndPoint = [0, 0]
    p2.vec2.rotate(this.rotatedEndPoint, this.endPoint, rotation)
    const destination = [0, 0]
    p2.vec2.add(destination, origin, p2.vec2.mul([0, 0], this.rotatedEndPoint, [1000, 1000]))
    this.calculateShortest(origin, destination, ignoredIDs)
  }

  calculateShortest (origin, destination, ignoredIDs) {
    this.shortest = {
      distance: Infinity
    }
    let t = this
    let ray = new p2.Ray({
      mode: p2.Ray.ALL,
      from: origin,
      to: destination,
      callback: (result) => {
        if (ignoredIDs.includes(result.body.id)) return
        let hitPoint = p2.vec2.create()
        result.getHitPoint(hitPoint, ray)
        let distance = result.getHitDistance(ray)
        if (distance < this.shortest.distance) {
          t.shortest.distance = distance
          t.shortest.body = result.body
        }
      }
    })
    ray.update()
    let result = new p2.RaycastResult()
    this.world.raycast(result, ray)
  }
}
