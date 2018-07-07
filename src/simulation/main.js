import GraphicsSystem from './systems/graphics.js'
import PhysicsSystem from './systems/physics.js'
import CarSystem from './systems/car.js'
import Car from './entities/car.js'
import Wall from './entities/wall.js'
import Sigma from 'sigma'
// import Chart from 'chart.js'
// import _ from 'lodash'
require('neataptic/graph/graph.js')

const CES = require('ces')

/**
 * Main class of simulation
 */
export default class Simulation {
  constructor (canvasElement, frames, visualizationID, chartCanvas) {
    this.visualizationID = visualizationID
    this.time = frames
    this.frames = frames
    this.canvasElement = canvasElement
    this.chartCanvas = chartCanvas
  }

  init (canvas) {
    if (this.world === undefined) {
      // this.chart = new Chart(this.chartCanvas,
      //   {
      //     type: 'line',
      //     data: {
      //       datasets: [{
      //         label: 'fitness',
      //         data: []
      //       }]
      //     },
      //     options: {
      //       scales: {
      //         yAxes: [{
      //           ticks: {
      //             beginAtZero: true
      //           }
      //         }]
      //       },
      //       animation: false
      //     }
      //   })
      // this.chart.data.labels = _.toArray(_.range(0, this.time, 10))
      this.renderer = new GraphicsSystem()
      this.renderer.setCanvas(canvas)
      this.world = new CES.World()
      this.world.addSystem(this.renderer)
      this.world.addSystem(new PhysicsSystem())
      this.world.addSystem(new CarSystem())
    }
    // this.drawGenome()
    Wall(0, 0, 10000, 10, this.world)
    Wall(0, 0, 10, 10000, this.world)
    Wall(700, 0, 10, 10000, this.world)
    this.car = Car(500.0, 250.0, this.world, this.genome)
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
    this.frames = this.time
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
    const delta = dt - this.lastDt
    this.frames -= 1
    this.lastDt = dt
    let currentFitness = this.car.getComponent('car').fitness
    if (this.frames >= 0) {
      this.world.update(delta)
      // requestAnimationFrame((dt) => this.update(dt))
      // if (this.frames % 10 === 0) {
      //   // this.chart.data.datasets[0].data.push(currentFitness)
      //   // this.chart.update()
      // }
    } else {
      // delete this.chart.data.datasets[0].data
      // this.chart.data.datasets[0].data = []
      this.onFinish(currentFitness)
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
