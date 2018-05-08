import * as CES from 'ces'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  acc: 0,
  update: function (dt) {
    this.acc += dt / 2
    this.world.getEntities('car').forEach((entity) => {
      const body = entity.getComponent('car')
      body.steer(Math.sin(this.acc))
      body.wheels.forEach((wheel) => {
        wheel.graphics.rotation = wheel.physics.steerValue
      })
    })
  }
})
