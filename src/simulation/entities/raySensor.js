import * as Matter from 'matter-js'
import * as PolyK from 'polyk'

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
      const vertices = []
      collisionInfo.vertices.forEach((point) => {
        vertices.push(point.x)
        vertices.push(point.y)
      })
      const result = PolyK.Raycast(vertices, origin.x, origin.y, endPoint.x, endPoint.y)
      if (result === null) {
        return {
          dist: Infinity
        }
      }
      return result.dist
    }
    this.shortest = this.bodies.map(function (body) {
      return {
        body: body,
        distance: getDistance(body)
      }
    }).reduce((acc, el) => el.distance < acc.distance ? el : acc, {distance: Infinity})
  }
}
