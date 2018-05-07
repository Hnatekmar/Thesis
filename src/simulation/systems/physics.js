import * as CES from 'ces'
import * as p2 from 'p2'

export default CES.System.extend({
  addedToWorld: function (world) {
    this.physicsWorld = new p2.World([0, 0])
    world.entityAdded('physics').add((entity) => this.physicsWorld.addBody(entity.getComponent('physics').body))
    world.entityRemoved('physics').add((entity) => this.physicsWorld.removeBody(entity.getComponent('physics').body))
  },
  update: function (dt) {
    this.physicsWorld.step(dt / 1000.0)
    this.world.getEntities('graphics', 'physics').forEach((entity) => {
      const body = entity.getComponent('physics').body
      const graphicsObject = entity.getComponent('graphics').container
      graphicsObject.setPosition(body.position[0], body.position[1])
      graphicsObject.rotation = body.rotation
    })
  }
})
