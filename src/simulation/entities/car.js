import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as Matter from 'matter-js'
import * as PIXI from 'pixi.js'
import CarComponent from '../components/car.js'

function rectangle (x, y, w, h, color) {
  const result = new PIXI.Graphics()
  result.beginFill(color, 0.5)
  result.drawRect(x, y, w, h)
  result.position.set(x, y)
  return result
}

function wheel (x, y, offset, force, range) {
  return {
    body: rectangle(offset.x, offset.y, 10, 20, 0xFFFFFF),
    angle: Math.PI / 4,
    angleFrom: -range * (Math.PI / 180.0),
    angleTo: range * (Math.PI / 180.0),
    offset: offset,
    speed: force,
    forward: Matter.Vector.create(0, -1)
  }
}

export default function (x, y, world) {
  const entity = new CES.Entity()
  const graphicsComponent = new GraphicsComponent([
    rectangle(0, 0, 100, 200, 0xff0000)
  ])
  graphicsComponent.container.position.set(x, y)
  entity.addComponent(graphicsComponent)
  entity.addComponent(new PhysicsComponent(
    Matter.Bodies.rectangle(x, y, 100, 200, {
      density: 0.78
    })
  ))
  entity.addComponent(new CarComponent(entity, [
    wheel(x, y, {x: 100, y: 10}, 0.1, 45),
    wheel(x, y, {x: -5, y: 10}, 0.1, 45),
    wheel(x, y, {x: -5, y: 190}, 0.0, 0),
    wheel(x, y, {x: 100, y: 190}, 0.0, 0)
  ]))
  world.addEntity(entity)
}
