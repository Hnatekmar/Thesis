
import GraphicsSystem from './systems/graphics.js'
import Car from './entities/car.js'

const CES = require('ces')

/**
 * Main class of simulation
 */
export default class Simulation {
  constructor (canvasElement) {
    this.world = new CES.World()
    const graphics = new GraphicsSystem()
    graphics.setCanvas(canvasElement)
    this.world.addSystem(graphics)
    this.world.addEntity(Car(150, 150))
    requestAnimationFrame(() => this.update())
  }

  /**
   * Main simulation loop
   */
  update () {
    this.world.update()
    requestAnimationFrame(() => this.update())
  }

  /**
   * Called on component destruction
   */
  destroy () {
  }
}
