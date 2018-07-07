import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as Matter from 'matter-js'
import * as PIXI from 'pixi.js'
import CarComponent from '../components/car.js'

// function rectangle (x, y, w, h, color) {
//   const result = new PIXI.Graphics()
//   result.beginFill(color, 1.0)
//   result.drawRect(x, y, w, h)
//   result.position.set(x, y)
//   result.cacheAsBitmap = true
//   return result
// }

function wheel (x, y, offset, force, range) {
  let wheelRectangle = new PIXI.Sprite(PIXI.loader.resources['./static/wheel.png'].texture)
  wheelRectangle.position.set(offset.x, offset.y)
  return {
    body: wheelRectangle,
    angle: Math.PI / 4,
    angleFrom: -range * (Math.PI / 180.0),
    angleTo: range * (Math.PI / 180.0),
    offset: offset,
    speed: force,
    forward: Matter.Vector.create(0, -1)
  }
}

export default function (x, y, world, genome) {
  const entity = new CES.Entity()
  const graphicsComponent = new GraphicsComponent([
    new PIXI.Sprite(PIXI.loader.resources['./static/chassis.png'].texture)
  ])
  graphicsComponent.container.position.set(x, y)
  entity.addComponent(graphicsComponent)
  entity.addComponent(new PhysicsComponent(
    Matter.Bodies.rectangle(x, y, 100, 200, {
      density: 0.90,
      friction: 0.1
    })
  ))
  entity.addComponent(new CarComponent(entity, [
    wheel(x, y, {x: 100, y: 0}, 0.2, 45),
    wheel(x, y, {x: -0, y: 0}, 0.2, 45),
    wheel(x, y, {x: -10, y: 180}, 0.0, 0),
    wheel(x, y, {x: 100, y: 180}, 0.0, 0)
  ], genome))
  world.addEntity(entity)
  return entity
}
