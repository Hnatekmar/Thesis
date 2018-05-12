import GraphicsSystem from './systems/graphics.js'
import PhysicsSystem from './systems/physics.js'
import CarSystem from './systems/car.js'
import Car from './entities/car.js'
import Wall from './entities/wall.js'

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
    this.world.addSystem(new PhysicsSystem())
    this.world.addSystem(new CarSystem())
    Car(200.0, 550.0, this.world)
    Wall(0, 0, 10000, 20, this.world)
    requestAnimationFrame((dt) => this.update(dt))
    this.lastDt = 0
  }

  /**
   * Main simulation loop
   */
  update (dt) {
    const delta = dt - this.lastDt
    this.lastDt = dt
    this.world.update(delta / 1000.0)
    requestAnimationFrame((dt) => this.update(dt))
  }

  /**
   * Called on component destruction
   */
  destroy () {
  }
}
