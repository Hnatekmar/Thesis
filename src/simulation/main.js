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
    if (this.world === undefined) {
      this.renderer = new GraphicsSystem()
      this.renderer.setCanvas(canvas)
      this.world = new CES.World()
      this.world.addSystem(this.renderer)
      this.world.addSystem(new PhysicsSystem())
      this.world.addSystem(new CarSystem())
    } else {
      this.renderer.setCanvas(canvas)
    }
    this.car = Car(100.0, 500.0, this.world, this.genome)
    Wall(20, 0, 20, 5000, this.world)
    Wall(190, 0, 20, 5000, this.world)
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
