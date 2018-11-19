<template>
  <div class="hello">
    <canvas id="chart"></canvas>
    <div>
      <progress id="progressBar"></progress>
    </div>
    <span v-for="n in numberOfEvaluators" :key="n">
      <simulation :id="n"></simulation>
    </span>
    <div id="fastForward">
      <img src="static/fast_forward_off.png"/>
    </div>
  </div>
</template>

<script>

import Simulation from './Simulation'
import NEAT from 'neataptic'
import ASYNC from 'async'
import _ from 'lodash'
import * as PIXI from 'pixi.js'
import * as Chart from 'chart.js'
import * as $ from 'jquery'

export default {
  name: 'HelloWorld',
  components: {Simulation},
  mounted: function () {
    let chartCanvas = document.getElementById('chart').getContext('2d')
    this.chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Best Fitness',
          lineTension: 0,
          data: [],
          backgroundColor: 'rgba(0,255,0,0.8)',
          borderColor: 'rgba(0,255,0,0.8)',
          fill: false
        }, {
          label: 'Avg. fitness',
          lineTension: 0,
          data: [],
          backgroundColor: 'rgba(0,0,255,0.8)',
          borderColor: 'rgba(0,0,255,0.8)',
          fill: false
        }, {
          label: 'Worst fitness',
          lineTension: 0,
          data: [],
          backgroundColor: 'rgba(255,0,0,0.8)',
          borderColor: 'rgba(255,0,0,0.8)',
          fill: false
        }]
      },
      options: {
        animation: false
      }
    })
    this.neat = new NEAT.Neat(
      37,
      6, // LEFT, RIGHT, FORWARD, BACKWARDS, BREAK
      null,
      {
        popsize: 128,
        mutation: NEAT.methods.mutation.ALL,
        mutationRate: 0.2
      }
    )
    let best = localStorage.getItem('best')
    if (best !== null) {
      best = JSON.parse(best)
      this.neat.population[0] = NEAT.Network.fromJSON(best)
    }

    const t = this
    const afterLoad = function () {
      $('#fastForward').click(function () {
        $('#fastForward img').attr('src',
          $('#fastForward img').attr('src') === 'static/fast_forward_on.png'
            ? 'static/fast_forward_off.png' : 'static/fast_forward_on.png')
        t.$children.forEach(function (container) {
          container.simulation.renderer.draw = !container.simulation.renderer.draw
        })
      })
      let start = null
      function update (timestamp) {
        if (!start) start = timestamp
        let dt = timestamp - start
        if (dt < 1000 / 30.0) {
          window.requestAnimationFrame(update)
          return
        }
        dt = 1000 / 30.0
        start = timestamp
        dt = dt / 1000
        let tmp = start
        t.$children.forEach((container) => {
          if (!container.simulation.renderer.draw) {
            let interval = container.simulation.time - container.simulation.acc
            while (interval >= 0 && !container.simulation.renderer.draw) {
              interval -= dt
              tmp += dt
              container.simulation.update(dt)
            }
          } else {
            container.simulation.update(dt)
          }
        })
        start = tmp
        window.requestAnimationFrame(update)
      }
      window.requestAnimationFrame(update)
      const neat = t.neat
      ASYNC.forever(
        function (next) {
          // Split to chunks
          const chunks = _.toArray(_.chunk(neat.population, neat.population.length / t.$children.length))
          let progressBar = $('#progressBar')

          progressBar.attr('max', neat.population.length)
          progressBar.attr('value', 0)
          ASYNC.eachOf(chunks,
            async function (chunk, index, callback) {
              for (let i in chunk) {
                // noinspection JSUnfilteredForInLoop
                chunk[i].score = await t.$children[index].simulation.evaluate(chunk[i])
                progressBar.attr('value', parseInt(progressBar.attr('value'), 10) + 1)
                chunk[i].score -= chunk[i].nodes.length * 100
              }
              callback()
            },
            function () {
              neat.sort()

              // From https://wagenaartje.github.io/neataptic/docs/neat/
              let newPopulation = []

              t.chart.data.labels.push(neat.generation)
              t.chart.data.datasets[0].data.push(neat.population[0].score)
              let avg = neat.population.reduce((acc, el) => acc + el.score, 0.0) / neat.population.length
              t.chart.data.datasets[1].data.push(avg)
              t.chart.data.datasets[2].data.push(neat.population[neat.population.length - 1].score)
              console.log(neat.population[0].score)
              t.chart.update()
              // Elitism
              for (let i = 0; i < neat.elitism; i++) {
                newPopulation.push(neat.population[i])
              }

              // Breed the next individuals
              for (let i = 0; i < neat.popsize - neat.elitism; i++) {
                newPopulation.push(neat.getOffspring())
              }
              // Replace the old population with the new population
              neat.population = newPopulation
              neat.mutate()

              neat.generation++
              next()
            })
        }
      )
    }

    console.log('Loading assets')
    PIXI.loader
      .add('./static/chassis.png')
      .add('./static/wheel.png')
      .load()
    PIXI.loader.onComplete.add(afterLoad)
  },
  data () {
    return {
      numberOfEvaluators: 8
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  #progressBar {
    width: 100%;
    will-change: transform;
  }
  #chart {
    will-change: transform;
    display:block;
    margin-left:auto;
    margin-right:auto;
    width: 90%;
  }
</style>
