import * as CES from 'ces'

/*
 * Component that represents car
 */
export default CES.Component.extend({
  name: 'car',
  force: 0.5,
  init: function (chassis, wheels) {
    this.chassis = chassis
    const graphics = this.chassis.getComponent('graphics').container
    wheels.forEach((wheel) => {
      graphics.addChild(wheel.body)
      wheel.body.pivot.set(wheel.offset.x + wheel.width / 2, wheel.offset.y + wheel.height / 2)
    })
    this.wheels = wheels
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
