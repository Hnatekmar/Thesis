import * as CES from 'ces'
import * as p2 from 'p2'

/*
 * Component that represents car
 */
export default CES.Component.extend({
  name: 'car',
  steering: Math.PI / 16,
  force: 0.5,
  init: function (chassis, wheels) {
    this.vehicle = new p2.TopDownVehicle(chassis)
    for (let i = 0; i < wheels.length; i++) {
      wheels[i].physics = this.vehicle.addWheel(wheels[i].physics)
      wheels[i].physics.steerValue = -this.steering
      wheels[i].physics.engineForce = this.force
    }
    this.wheels = wheels
  },
  steer: function (angle) {
    this.wheels.forEach(function (wheel) {
      wheel.physics.steerValue = -angle
    })
  }
})
