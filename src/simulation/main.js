
import Graphics from './systems/Graphics.js'

const CES = require('ces')

/**
 * Main class of simulation
 */
export default class Simulation {
  constructor (canvasElement) {
    this.world = new CES.World()
    const graphics = new Graphics()
    graphics.setCanvas(canvasElement)
    this.world.addSystem(graphics)
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
