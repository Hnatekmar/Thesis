import * as CES from 'ces'
import * as p2 from 'p2'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  update: function (dt) {
    this.world.getEntities('car').forEach((entity) => {
      const body = entity.getComponent('car')

      const pb = body.chassis.getComponent('physics').body
      pb.world.on('beginContact', (event) => {
        let bodyA = event.bodyA
        let bodyB = event.bodyB
        if (pb.sleepState !== p2.Body.SLEEPING) body.fitness -= 10000
        if ((bodyA.id === pb.id) || (bodyB.id === pb.id)) {
          pb.allowSleep = true
          pb.force = [0, 0]
          pb.sleep()
        }
      })

      body.sensors.forEach(function (sensor) {
        sensor.cast(pb.position, [pb.id], pb.angle)
        if (sensor.shortest.distance === Infinity) sensor.shortest.distance = 10000
      })

      let vel = Math.sqrt(p2.vec2.squaredLength(pb.velocity))
      if (pb.sleepState === p2.Body.SLEEPING) return
      body.fitness += vel
      const input = body.sensors.map((sensor) => sensor.shortest.distance / 1000)
      let output = body.genome.activate(input)
      output[0] = 0
      body.frontWheel.steerValue = (Math.PI / 4) * (output[1] * 2 - 1)
      body.frontWheel.engineForce = (output[0] * 2 - 1) * 40000
      body.backWheel.engineForce = (output[0] * 2 - 1) * 40000
    })
  }
})
