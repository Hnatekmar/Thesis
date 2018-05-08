import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as p2 from 'p2'
import * as PIXI from 'pixi.js'

function rectangle (x, y, w, h, color) {
  const result = new PIXI.Graphics()
  result.beginFill(color)
  result.drawRect(x, y, w, h)
  result.position.set(x, y)
  return result
}

export default function (x, y) {
  const entity = new CES.Entity()
  const graphicsComponent = new GraphicsComponent([
    rectangle(0, 0, 100, 200, 0xff0000)
  ])
  graphicsComponent.container.position.set(x, y)
  entity.addComponent(graphicsComponent)
  entity.addComponent(new PhysicsComponent(
    1,
    [x, y],
    [
      new p2.Box({
        width: 100,
        height: 200
      })
    ]
  ))
  return entity
}
