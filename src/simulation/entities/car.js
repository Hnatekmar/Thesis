import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as p2 from 'p2'
import * as PIXI from 'pixi.js'
import CarComponent from '../components/car.js'

function rectangle (x, y, w, h, color) {
  const result = new PIXI.Graphics()
  result.beginFill(color)
  result.drawRect(x, y, w, h)
  result.position.set(x, y)
  return result
}

function wheel (position, graphics) {
  const g = rectangle(position[0], position[1], 10, 20, 0xffffff)
  g.pivot.set(position[0], position[1])
  graphics.addChild(g)
  return {
    physics: {
      localPosition: position,
      localForwardVector: [0, 0.5]
    },
    graphics: g
  }
}

export default function (x, y) {
  // Chassis
  const chassis = new CES.Entity()
  const graphicsComponent = new GraphicsComponent([
    rectangle(0, 0, 100, 200, 0xff0000)
  ])
  graphicsComponent.container.position.set(x, y)
  chassis.addComponent(graphicsComponent)
  chassis.addComponent(new PhysicsComponent(
    1,
    [x, y],
    [
      new p2.Box({
        width: 100,
        height: 200
      })
    ]
  ))
  const wheels = [
    wheel([-10, 0], graphicsComponent.container),
    wheel([100, 0], graphicsComponent.container)
  ]
  chassis.addComponent(
    new CarComponent(
      chassis.getComponent('physics').body,
      wheels)
  )
  return chassis
}
