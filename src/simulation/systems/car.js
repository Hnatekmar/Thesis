import * as CES from 'ces'
import * as p2 from 'p2'

function indexOfMaximum (arr) {
  let index = -1
  let maximum = -1
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > maximum) {
      maximum = arr[i]
      index = i
    }
  }
  return index
}

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  update: function (dt) {
    this.world.getEntities('car').forEach((entity) => {
      const body = entity.getComponent('car')

      const pb = body.chassis.getComponent('physics').body
      pb.world.on('beginContact', (event) => {
        let bodyA = event.bodyA
        let bodyB = event.bodyB
        if (pb.sleepState !== p2.Body.SLEEPING) body.fitness -= 50000
        if ((bodyA.id === pb.id) || (bodyB.id === pb.id)) {
          pb.allowSleep = true
          pb.force = [0, 0]
          pb.sleep()
        }
      })

      body.sensors.forEach(function (sensor) {
        sensor.cast(pb.position, [pb.id], pb.angle)
        if (sensor.shortest.distance === Infinity || sensor.shortest.distance > 800) sensor.shortest.distance = 800
      })

      let vel = Math.sqrt(p2.vec2.squaredLength(pb.velocity))
      if (pb.sleepState === p2.Body.SLEEPING) return
      const input = body.sensors.map((sensor) => 1 - sensor.shortest.distance / 800)
      let output = body.genome.activate(input)
      for (let i = 0; i < output.length; i++) {
        if (isNaN(output[i])) {
          output[i] = 0
          body.fitness = -Number.MAX_VALUE
          pb.allowSleep = true
          pb.force = [0, 0]
          pb.sleep()
          return
        }
      }
      let throttleControl = output.slice(1, 4)
      let choice = indexOfMaximum(throttleControl)
      let dir = 0
      body.backWheel.setBrakeForce(0)
      body.frontWheel.setBrakeForce(0)
      body.frontWheel.setSideFriction(8000)
      body.backWheel.setSideFriction(6000)
      if (choice === 0) { // FORWARD
        dir = -1
        body.fitness += vel
      } else if (choice === 1) { // BACKWARDS
        dir = 0.5
        body.fitness += vel * 0.5
      } else if (choice === 2) { // BREAK
        if (vel === 0.0) {
          pb.allowSleep = true
          pb.force = [0, 0]
          pb.sleep()
        }
        dir = 0
        body.fitness -= 100
        body.frontWheel.setBrakeForce(5 * 2000)
      }
      body.frontWheel.steerValue = (Math.PI / 180.0) * (-45 + output[0] * 90)
      // body.frontWheel.engineForce = dir * 40000
      body.backWheel.engineForce = dir * 7 * 9000
    })
  }
})
