import * as CES from 'ces'
import * as _ from 'lodash'
import * as ray from '../entities/raySensor'

/*
 * Component that represents car
 */
export default CES.Component.extend({
  name: 'car',
  force: 0.5,
  init: function (chassis, wheels) {
    this.sensors = _.range(180 + 45, 360 - 45, 2.0).map((el) => new ray.Sensor({x: Math.cos(el * (Math.PI / 180)), y: Math.sin(el * (Math.PI / 180))}))
    this.chassis = chassis
    const graphics = this.chassis.getComponent('graphics').container
    this.debugDrawer = null
    wheels.forEach((wheel) => {
      graphics.addChild(wheel.body)
      wheel.body.pivot.set(wheel.offset.x + wheel.body.width / 2, wheel.offset.y + wheel.body.height / 2)
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
