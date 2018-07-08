import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as PIXI from 'pixi.js'
import * as p2 from 'p2'
import CarComponent from '../components/car.js'
import * as _ from 'lodash'
import * as ray from '../entities/raySensor'

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
    speed: 0.0,
    maximumSpeed: force,
    forward: [0, -1]
  }
}

export default function (x, y, world, genome) {
  const entity = new CES.Entity()
  const graphicsComponent = new GraphicsComponent([
    new PIXI.Sprite(PIXI.loader.resources['./static/chassis.png'].texture)
  ])
  entity.addComponent(graphicsComponent)
  let body = new p2.Body({
    mass: 1,
    position: [x, y],
    allowSleep: false
  })
  body.addShape(new p2.Box({
    width: 100,
    height: 200
  }))
  entity.addComponent(new PhysicsComponent(
    body
    // Matter.Bodies.rectangle(x, y, 100, 200, {
    //   density: 0.90,
    //   friction: 0.1
    // })
  ))
  entity.addComponent(new CarComponent(entity, [
    wheel(x, y, {x: 100, y: 0}, 1000, 45),
    wheel(x, y, {x: -0, y: 0}, 1000, 45),
    wheel(x, y, {x: -10, y: 180}, 0.0, 0),
    wheel(x, y, {x: 100, y: 180}, 0.0, 0)
  ], genome))
  world.addEntity(entity)
  let carComponent = entity.getComponent('car')
  let p2World = entity.getComponent('physics').world
  carComponent.sensors = _.range(180 + 45, 360 - 45, 10.0)
    .map((el) => new ray.Sensor([Math.cos(el * (Math.PI / 180)), Math.sin(el * (Math.PI / 180))], p2World))
  return entity
}
