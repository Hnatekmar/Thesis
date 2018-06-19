import * as Matter from 'matter-js'
import * as PolyK from 'polyk'

export class Sensor {
  constructor (endPoint) {
    this.endPoint = endPoint
    this.bodies = []
    this.shortest = null
  }
  cast (origin, bodies, rotation) {
    const destination = Matter.Vector.rotate(Matter.Vector.add(origin, this.endPoint), rotation)
    this.bodies = Matter.Query.ray(bodies, origin, destination, 10000)
    this.calculateShortest(origin, destination)
  }
  calculateShortest (origin) {
    const endPoint = this.endPoint
    function getDistance (collisionInfo) {
      const vertices = []
      collisionInfo.body.vertices.forEach((point) => {
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
