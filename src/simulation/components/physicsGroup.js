import * as CES from 'ces'

export default CES.Component.extend({
  name: 'physicsGroup',
  init: function (bodies) {
    let assert = require('assert')
    assert(bodies instanceof Array)
    this.bodies = bodies
    this.bodies.forEach((el) => {
      el.oldOrigin = el.position
    })
  },
  /**
   * moves all object by relative offset
   */
  move: function (offsetX, offsetY) {
    this.bodies.forEach((el) => {
      el.position[0] += offsetX
      el.position[1] += offsetY
    })
  },
  moveAbsolute: function (x, y) {
    this.bodies.forEach((el) => {
      el.position = el.oldOrigin
    })
    this.move(x, y)
  }
})
