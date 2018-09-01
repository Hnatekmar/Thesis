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
        if (pb.sleepState !== p2.Body.SLEEPING) body.fitness -= 10000
        if ((bodyA.id === pb.id) || (bodyB.id === pb.id)) {
          pb.allowSleep = true
          pb.force = [0, 0]
          pb.sleep()
        }
      })

      body.sensors.forEach(function (sensor) {
        sensor.cast(pb.position, [pb.id], pb.angle)
        if (sensor.shortest.distance === Infinity) sensor.shortest.distance = 800
      })

      let vel = Math.sqrt(p2.vec2.squaredLength(pb.velocity))
      if (pb.sleepState === p2.Body.SLEEPING) return
      body.fitness += vel
      const input = body.sensors.map((sensor) => sensor.shortest.distance / 800)
      let output = body.genome.activate(input)
      let throttleControl = output.slice(1, 3)
      let choice = indexOfMaximum(throttleControl)
      let dir = 0
      body.backWheel.setBrakeForce(0)
      body.frontWheel.setBrakeForce(0)
      if (choice === 0) { // FORWARD
        dir = 1
      } else if (choice === 1) { // BACKWARDS
        dir = -1
      } else if (choice === 2) { // BREAK
        dir = 0
        body.backWheel.setBrakeForce(4000)
        body.frontWheel.setBrakeForce(4000)
      }
      body.frontWheel.steerValue = (Math.PI / 10) * (output[0] * 2 - 1)
      body.frontWheel.engineForce = dir * 40000
      body.backWheel.engineForce = dir * 40000
    })
  }
})
