import * as CES from 'ces'
import * as Matter from 'matter-js'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  update: function (dt) {
    this.world.getEntities('car').forEach((entity) => {
      const body = entity.getComponent('car')
      body.wheels.forEach((wheel) => {
        wheel.body.rotation = wheel.angle
        const wheelUnitVector = Matter.Vector.rotate(wheel.forward, wheel.angle + wheel.body.parent.rotation)
        const wheelDirectionVector = Matter.Vector.mult(wheelUnitVector, body.force)
        const globalPosition = wheel.body.toGlobal(wheel.body.position)
        Matter.Body.applyForce(body.chassis.getComponent('physics').body, globalPosition, wheelDirectionVector)
      })
      const pb = body.chassis.getComponent('physics')
      if (body.debugDrawer !== null) body.debugDrawer.clear()
      body.sensors.forEach(function (sensor) {
        sensor.cast(pb.body.position, pb.world.bodies.filter((body) => body.id !== pb.body.id), pb.body.angle)
        if (sensor.shortest.distance === Infinity) sensor.shortest.distance = 1000
      })

      body.fitness += pb.body.speed
      const input = body.sensors.map((sensor) => sensor.shortest.distance)
      input.push(pb.body.speed)
      const output = body.genome.activate(input)
      body.steer((output[0] * 90 - 45) * Math.PI / 180)
      body.force = output[1] - 0.5
    })
  }
})
