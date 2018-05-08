import * as CES from 'ces'
import * as p2 from 'p2'

export default CES.Component.extend({
  name: 'physics',
  init: function (weight, pos, shapes) {
    this.body = new p2.Body({
      mass: weight,
      position: pos
    })
    shapes.forEach((shape) => this.body.addShape(shape))
  }
})
