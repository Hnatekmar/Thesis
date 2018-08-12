import * as CES from 'ces'
import PhysicsGroup from '../components/physicsGroup'

export default function (x, y, world, walls) {
  let entity = new CES.Entity()
  let wallPhysicsComponent = walls.map((wall) => wall.getComponent('physics'))
  entity.addComponent(new PhysicsGroup(wallPhysicsComponent))
  world.addEntity(entity)
  return entity
}
