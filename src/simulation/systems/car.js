import * as CES from 'ces'
import * as Matter from 'matter-js'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  acc: 0,
  update: function (dt) {
    this.acc += dt / 2
    this.world.getEntities('car').forEach((entity) => {
      const body = entity.getComponent('car')
      body.steer(Math.sin(this.acc))
      body.wheels.forEach((wheel) => {
        wheel.body.rotation = wheel.angle
        const wheelUnitVector = Matter.Vector.rotate(wheel.forward, wheel.angle + wheel.body.parent.rotation)
        const wheelDirectionVector = Matter.Vector.mult(wheelUnitVector, wheel.speed)
        const globalPosition = wheel.body.toGlobal(wheel.body.position)
        Matter.Body.applyForce(body.chassis.getComponent('physics').body, globalPosition, wheelDirectionVector)
      })
      const pb = body.chassis.getComponent('physics')
      body.sensors.forEach(function (sensor) {
        sensor.cast(pb.body.position, pb.world.bodies.filter((body) => body.id !== pb.body.id), 0)
      })
    })
  }
})
