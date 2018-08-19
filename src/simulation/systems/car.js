import * as CES from 'ces'
import * as p2 from 'p2'
import * as PIXI from 'pixi.js'

// import * as Matter from 'matter-js'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  update: function (dt) {
    this.world.getEntities('car').forEach((entity) => {
      const body = entity.getComponent('car')

      const pb = body.chassis.getComponent('physics').body
      pb.world.on('beginContact', (event) => {
        let bodyA = event.bodyA
        let bodyB = event.bodyB
        if ((bodyA.id === pb.id) || (bodyB.id === pb.id)) {
          pb.allowSleep = true
          pb.force = [0, 0]
          pb.sleep()
        }
      })
      if (body.debugDrawer !== null) body.debugDrawer.clear()
      body.sensors.forEach(function (sensor) {
        sensor.cast(pb.position, [pb.id], pb.angle)
        if (sensor.shortest.distance === Infinity) sensor.shortest.distance = 10000
      })

      let graphicsChassis = body.chassis.getComponent('graphics').container
      if (graphicsChassis.debug === undefined) {
        graphicsChassis.debug = new PIXI.Graphics()
        graphicsChassis.addChild(graphicsChassis.debug)
      }

      let vel = p2.vec2.squaredLength(pb.velocity)
      if (pb.sleepState === p2.Body.SLEEPING) return
      if (vel > 5000) vel *= -1
      body.fitness += vel
      const input = body.sensors.map((sensor) => sensor.shortest.distance / 10000)
      let output = body.genome.activate(input)
      output = output.map((x) => Math.max(0, Math.min(1, x)))
      let rotation = [0, 0]
      body.force = output[1] * 2000 - 1000
      p2.vec2.rotate(rotation, [0, -1], (output[0] * 50 - 25) * Math.PI / 180)
      let out = [0, 0]
      p2.vec2.mul(out, rotation, [body.force, body.force])
      graphicsChassis.debug.clear()
      graphicsChassis.debug.lineStyle(10, 0xffffff)
        .moveTo(50, 0)
        .lineTo(out[0], out[1])
      pb.applyImpulseLocal(out, [0, -100])
    })
  }
})
