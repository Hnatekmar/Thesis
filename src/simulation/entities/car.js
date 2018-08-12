import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as PIXI from 'pixi.js'
import * as p2 from 'p2'
import CarComponent from '../components/car.js'
import * as _ from 'lodash'
import * as ray from '../entities/raySensor'

export default function (x, y, world, genome) {
  const entity = new CES.Entity()
  const graphicsComponent = new GraphicsComponent([
    new PIXI.Sprite(PIXI.loader.resources['./static/chassis.png'].texture)
  ])
  entity.addComponent(graphicsComponent)
  let body = new p2.Body({
    mass: 2000,
    position: [x, y],
    allowSleep: false
  })
  body.addShape(new p2.Box({
    width: 100,
    height: 200
  }))
  entity.addComponent(new PhysicsComponent(
    body
  ))
  entity.addComponent(new CarComponent(entity, [
  ], genome))
  world.addEntity(entity)
  let carComponent = entity.getComponent('car')
  let p2World = entity.getComponent('physics').world
  carComponent.sensors = _.range(180 + 45, 360 - 45, 10.0)
    .map((el) => new ray.Sensor([Math.cos(el * (Math.PI / 180)), Math.sin(el * (Math.PI / 180))], p2World))
  return entity
}
