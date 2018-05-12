import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as Matter from 'matter-js'
import * as PIXI from 'pixi.js'

function rectangle (x, y, w, h, color) {
  const result = new PIXI.Graphics()
  result.beginFill(color, 0.5)
  result.drawRect(x, y, w, h)
  result.position.set(x, y)
  return result
}

export default function (x, y, w, h, world) {
  const entity = new CES.Entity()
  entity.addComponent(new GraphicsComponent([
    rectangle(0, 0, w, h, 0xCCCCCC)
  ]))
  entity.addComponent(new PhysicsComponent(
    Matter.Bodies.rectangle(x, y, w, h, {
      isStatic: true
    })
  ))
  world.addEntity(entity)
}
