import * as CES from 'ces'
import * as p2 from 'p2'
// import * as Matter from 'matter-js'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  update: function (dt) {
    this.world.getEntities('car').forEach((entity) => {
      const body = entity.getComponent('car')
      body.wheels.forEach((wheel) => {
        wheel.body.rotation = wheel.angle
        const wheelUnitVector = [0, 0]
        p2.vec2.rotate(wheelUnitVector, wheel.forward, wheel.angle + wheel.body.parent.parent.rotation)
        const wheelDirectionVector = [0, 0]
        p2.vec2.mul(wheelDirectionVector, wheelUnitVector, [body.force, body.force])
        body.chassis.getComponent('physics').body.applyForceLocal(wheelDirectionVector, [wheel.offset.x, wheel.offset.y])
        // const globalPosition = wheel.body.toGlobal(wheel.body.position)
        // Matter.Body.applyForce(body.chassis.getComponent('physics').body, globalPosition, wheelDirectionVector)
      })
      const pb = body.chassis.getComponent('physics').body
      if (body.debugDrawer !== null) body.debugDrawer.clear()
      body.sensors.forEach(function (sensor) {
        sensor.cast(pb.position, [pb.id], pb.angle)
        if (sensor.shortest.distance === Infinity) sensor.shortest.distance = 1000
      })

      body.fitness += p2.vec2.squaredLength(pb.velocity)
      const input = body.sensors.map((sensor) => sensor.shortest.distance / 10000)
      input.push(p2.vec2.squaredLength(pb.velocity) / 1000)
      const output = body.genome.activate(input)
      body.steer((output[0] * 90 - 45) * Math.PI / 180)
      body.force = output[1] * 10 - 5
    })
  }
})
