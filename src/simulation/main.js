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
  constructor (canvasElement, frames) {
    this.time = frames
    this.frames = frames
    this.canvasElement = canvasElement
  }

  init (canvas) {
    this.world = new CES.World()
    const graphics = new GraphicsSystem()
    graphics.setCanvas(canvas)
    this.world.addSystem(graphics)
    this.world.addSystem(new PhysicsSystem())
    this.world.addSystem(new CarSystem())
    this.car = Car(200.0, 250.0, this.world, this.genome)
    Wall(0, 20, 1000, 20, this.world)
    Wall(20, 0, 20, 1000, this.world)
    Wall(270, 0, 20, 1000, this.world)
    this.lastDt = 0
  }

  evaluate (genome) {
    this.destroy()
    this.genome = genome
    this.init(this.canvasElement)
    this.frames = this.time
    requestAnimationFrame((dt) => this.update(dt))
    let t = this
    return new Promise(
      function (resolve) {
        t.onFinish = resolve
      }
    )
  }
  /**
   * Main simulation loop
   */
  update (dt) {
    this.frames -= 1
    const delta = dt - this.lastDt
    this.lastDt = dt
    this.world.update(delta / 1000.0)
    if (this.frames >= 0) {
      requestAnimationFrame((dt) => this.update(dt))
    } else {
      console.log(this.genome)
      console.log(this.car.getComponent('car').fitness)
      this.onFinish(this.car.getComponent('car').fitness)
    }
  }

  /**
   * Called on component destruction
   */
  destroy () {
    if (this.world !== undefined) {
      const allEntities = this.world.getEntities()
      allEntities.forEach((entity) => this.world.removeEntity(entity))
    }
  }
}
