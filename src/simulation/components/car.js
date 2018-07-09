import * as CES from 'ces'

/*
 * Component that represents car
 */
export default CES.Component.extend({
  name: 'car',
  force: 0.0,
  init: function (chassis, wheels, genome) {
    this.genome = genome
    this.chassis = chassis
    this.debugDrawer = null
    // wheels.forEach((wheel) => {
    //   graphics.addChild(wheel.body)
    //   // wheel.body.pivot.set(wheel.offset.x + wheel.body.width / 2, wheel.offset.y + wheel.body.height / 2)
    // })
    // this.wheels = wheels
    this.fitness = 0
  },
  getAngle: function (wheel, angle) {
    if (angle < wheel.angleFrom) angle = wheel.angleFrom
    if (angle > wheel.angleTo) angle = wheel.angleTo
    return angle
  },
  steer: function (angle) {
    this.wheels.forEach((wheel) => {
      wheel.angle = this.getAngle(wheel, angle)
    })
  }
})
