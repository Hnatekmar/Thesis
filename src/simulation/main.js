import GraphicsSystem from './systems/graphics.js'
import PhysicsSystem from './systems/physics.js'
import CarSystem from './systems/car.js'
import Car from './entities/car.js'
import Wall from './entities/wall.js'
import Sigma from 'sigma'
// const MemoryPool = require('memorypool')

const CES = require('ces')

/**
 * Main class of simulation
 */
export default class Simulation {
  constructor (canvasElement, frames, visualizationID) {
    this.visualizationID = visualizationID
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
      this.physicsSystem = new PhysicsSystem()
      this.world.addSystem(this.physicsSystem)
      this.world.addSystem(new CarSystem())
      // this.drawGenome()
      Wall(0, 0, 10000, 10, this.world)
      Wall(0, 0, 10, 10000, this.world)
      Wall(700, 0, 10, 500, this.world)
      Wall(250, 500, 500, 10, this.world)
      this.car = Car(500.0, 250.0, this.world, this.genome)
    } else {
      this.car.getComponent('car').genome = this.genome
    }
    this.lastDt = 0
  }

  generateGraph (width, height, sigma) {
    sigma.graph.clear()
    const graph = this.genome.graph(width, height)

    function getPosition (nodeID) {
      let zero = {x: 0, y: 0}
      if (graph.constraints === undefined) return zero
      let offsetX = graph.constraints[0].offsets.filter((of) => of.node === nodeID)
      let offsetY = graph.constraints[1].offsets.filter((of) => of.node === nodeID)
      if (offsetX.length === 0 || offsetY.length === 0) return zero
      return {
        x: offsetX[0].offset,
        y: offsetY[0].offset
      }
    }

    for (let nodeID in graph.nodes) {
      // noinspection JSUnfilteredForInLoop
      let node = graph.nodes[nodeID]
      let position = getPosition(node.id)
      // noinspection JSUnfilteredForInLoop
      let result = {
        id: node.id.toString(),
        label: node.name + ' ',
        x: position.x,
        y: position.y,
        size: 1
      }
      sigma.graph.addNode(result)
    }
    for (let linkID in graph.links) {
      // noinspection JSUnfilteredForInLoop
      let link = graph.links[linkID]
      link.id = linkID
      link.source = link.source.toString()
      link.target = link.target.toString()
      link.color = 'red'
      link.size = link.weight * 10
      sigma.graph.addEdge(link)
    }
    sigma.settings({
      scalingMode: 'outside',
      minEdgeSize: 0.1,
      maxEdgeSize: 10.0
    })
    sigma.refresh()
  }

  drawGenome () {
    if (this.sigma === undefined) {
      // noinspection JSPotentiallyInvalidConstructorUsage eslint-disable-next-line new-cap
      this.sigma = new Sigma(this.visualizationID)
    }
    this.generateGraph(this.visualizationID.clientWidth, this.visualizationID.clientHeight, this.sigma)
  }

  evaluate (genome) {
    this.destroy()
    this.genome = genome
    this.init(this.canvasElement)
    this.acc = 0
    this.lastDt = null
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
    if (this.lastDt === null) this.lastDt = dt
    const delta = dt - this.lastDt
    this.lastDt = dt
    this.acc += delta / 1000
    let currentFitness = this.car.getComponent('car').fitness
    if (this.acc < this.time) {
      this.world.update(delta)
    } else {
      this.onFinish(currentFitness)
    }
  }

  /**
   * Called on component destruction
   */
  destroy () {
    if (this.world !== undefined) {
      // let physicsBody = this.car.getComponent('physics').body
      // Matter.Body.setAngle(physicsBody, 0)
      // Matter.Body.setAngularVelocity(physicsBody, 0)
      // Matter.Body.setVelocity(physicsBody, this.velocity)
      // Matter.Body.setPosition(physicsBody, this.position)
      this.car.getComponent('car').fitness = 0
      let body = this.car.getComponent('physics').body
      body.setZeroForce()
      body.position = [this.position[0], this.position[1]]
      body.angularVelocity = 0
      body.velocity = [0, 0]
      body.angle = 0
      // let entities = this.b2World.getEntities()
      // entities.forEach((entity) => this.b2World.removeEntity(entity))
      // Matter.World.clear(this.physicsSystem.engine.b2World)
      // Matter.Engine.clear(this.physicsSystem.engine)
    } else {
      this.position = [500, 250]
      this.velocity = [0, 0]
    }
  }
}
