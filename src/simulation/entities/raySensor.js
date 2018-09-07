// import * as PolyK from 'polyk'
// import * as _ from 'lodash'
import * as p2 from 'p2'
export class Sensor {
  constructor (endPoint, world) {
    this.endPoint = endPoint
    this.world = world
    this.shortest = null
    let t = this
    this.shortest = {
      distance: Infinity
    }
    this.ray = new p2.Ray({
      mode: p2.Ray.ALL,
      from: t.origin,
      to: t.endPoint,
      callback: (result) => {
        if (t.ignoredIDs.includes(result.body.id)) return
        let distance = result.getHitDistance(t.ray)
        if (distance < this.shortest.distance) {
          t.shortest.distance = distance
          t.shortest.body = result.body
        }
      }
    })
  }
  cast (origin, ignoredIDs, rotation) {
    this.rotatedEndPoint = [0, 0]
    p2.vec2.rotate(this.rotatedEndPoint, this.endPoint, rotation)
    const destination = [0, 0]
    this.rotatedEndPoint[0] *= 800
    this.rotatedEndPoint[1] *= 800
    p2.vec2.add(destination, origin, this.rotatedEndPoint) // p2.vec2.mul([0, 0], this.rotatedEndPoint, [1000, 1000]))
    this.ignoredIDs = ignoredIDs
    this.calculateShortest(origin, destination)
  }

  calculateShortest (origin, destination) {
    this.ray.from = origin
    this.ray.to = destination
    this.ray.update()
    let result = new p2.RaycastResult()
    this.world.raycast(result, this.ray)
  }
}
