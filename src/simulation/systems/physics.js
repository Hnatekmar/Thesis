import * as CES from 'ces'
import * as p2 from 'p2'

export default CES.System.extend({
  addedToWorld: function (world) {
    this._super(world)
    this.physicsWorld = new p2.World({
      gravity: [0, 0]
    })
    world.entityAdded('physics').add((entity) => this.physicsWorld.addBody(entity.getComponent('physics').body))
    world.entityAdded('car').add((entity) => entity.getComponent('car').vehicle.addToWorld(this.physicsWorld))
    world.entityRemoved('physics').add((entity) => this.physicsWorld.removeBody(entity.getComponent('physics').body))
  },
  update: function (dt) {
    this.world.getEntities('graphics', 'physics').forEach((entity) => {
      const body = entity.getComponent('physics').body
      const graphicsObject = entity.getComponent('graphics').container
      graphicsObject.position.set(body.position[0], -body.position[1])
      graphicsObject.rotation = body.angle
    })
    this.physicsWorld.step(1 / 60, dt, 10)
  }
})
