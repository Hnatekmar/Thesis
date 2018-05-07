import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
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
  return entity
}
