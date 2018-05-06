/**
 * Main class of simulation
 */
export default class Simulation {
  constructor (canvasElement) {
    this.canvas = canvasElement
    this.ecs = require('tiny-ecs')
    this.entities = new this.ecs.EntityManager()
    this.regl = require('regl')(this.canvas)
    this.regl.frame(({tick}) => this.update(tick))
  }

  /**
   * Main simulation loop
   * @param tick - how much time has passed since last frame
   */
  update (tick) {
    this.regl.clear({
      color: [0, 0, 0, 1]
    })
  }

  /**
   * Called on component destruction
   */
  destroy () {
    this.regl.destroy()
  }
}
