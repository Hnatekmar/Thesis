import * as CES from 'ces'
import * as Matter from 'matter-js'

export default CES.System.extend({
  addedToWorld: function (world) {
    this._super(world)
    this.engine = Matter.Engine.create()
    this.engine.world.gravity.x = 0
    this.engine.world.gravity.y = 0
    world.entityAdded('physics').add((entity) => {
      entity.getComponent('physics').world = this.engine.world
      Matter.World.add(this.engine.world, [entity.getComponent('physics').body], true)
    })
    world.entityRemoved('physics').add(
      (entity) => {
        Matter.World.remove(this.engine.world, entity.getComponent('physics').body, true)
      })
  },
  update: function (dt) {
    this.world.getEntities('graphics', 'physics').forEach((entity) => {
      const body = entity.getComponent('physics').body
      const graphicsObject = entity.getComponent('graphics').container
      graphicsObject.position.set(body.position.x, body.position.y)
      graphicsObject.rotation = body.angle
    })

    Matter.Engine.update(this.engine, dt)
  }
})
