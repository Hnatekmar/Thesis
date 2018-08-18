
export default class PhysicsGroup {
  constructor (bodies) {
    let assert = require('assert')
    assert(bodies instanceof Array)
    this.bodies = bodies
    console.log(this.bodies)
    this.bodies.forEach((el) => {
      el.oldOrigin = el.body.position
    })
  }
  /**
   * moves all object by relative offset
   */
  move (offsetX, offsetY) {
    this.bodies.forEach((el) => {
      el.body.position[0] += offsetX
      el.body.position[1] += offsetY
    })
  }
  moveAbsolute (x, y) {
    this.bodies.forEach((el) => {
      el.body.position = el.oldOrigin
    })
    this.move(x, y)
  }
}
