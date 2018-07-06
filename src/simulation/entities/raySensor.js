import * as Matter from 'matter-js'
import * as PolyK from 'polyk'
import _ from 'lodash'

export class Sensor {
  constructor (endPoint) {
    this.endPoint = endPoint
    this.bodies = []
    this.shortest = null
  }
  cast (origin, bodies, rotation) {
    this.rotatedEndPoint = Matter.Vector.rotate(this.endPoint, rotation)
    const destination = Matter.Vector.add(origin, this.rotatedEndPoint)
    this.bodies = bodies
    this.calculateShortest(origin, destination)
  }
  calculateShortest (origin) {
    const endPoint = this.rotatedEndPoint
    function getDistance (collisionInfo) {
      if (collisionInfo.cache === undefined) {
        collisionInfo.cache = _.toArray(_.flatMap(collisionInfo.vertices, (point) => [point.x, point.y]))
      }
      let result = PolyK.Raycast(collisionInfo.cache, origin.x, origin.y, endPoint.x, endPoint.y)
      if (result === null) {
        return {
          body: origin,
          distance: Infinity
        }
      }
      return {
        body: origin,
        distance: result
      }
    }
    this.shortest = this.bodies.map(getDistance).reduce((acc, el) => el.distance < acc.distance ? el : acc, {distance: Infinity})
  }
}
