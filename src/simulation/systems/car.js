import * as CES from 'ces'
import * as Matter from 'matter-js'
import * as PIXI from 'pixi.js'

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
      if (body.debugDrawer !== null) body.debugDrawer.clear()
      body.sensors.forEach(function (sensor) {
        sensor.cast(pb.body.position, pb.world.bodies.filter((body) => body.id !== pb.body.id), pb.body.angle)
        if (sensor.shortest.distance === Infinity) sensor.shortest.distance = 100000
        if (sensor.shortest.distance !== Infinity) {
          if (body.debugDrawer === null) {
            body.debugDrawer = new PIXI.Graphics()
            const parent = body.chassis.getComponent('graphics').container
            parent.parent.addChild(body.debugDrawer)
          }
          body.debugDrawer.lineStyle(1, 0x00FF00)
          body.debugDrawer.moveTo(pb.body.position.x, pb.body.position.y)
          body.debugDrawer.lineTo(pb.body.position.x + sensor.rotatedEndPoint.x * sensor.shortest.distance, pb.body.position.y + sensor.rotatedEndPoint.y * sensor.shortest.distance)
          body.debugDrawer.endFill()
        }
      })
    })
  }
})
