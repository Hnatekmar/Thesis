<template>
  <div class="hello">
    <canvas id="chart"></canvas>
    <span v-for="n in numberOfEvaluators" :key="n">
      <simulation :id="n"></simulation>
    </span>
  </div>
</template>

<script>

import Simulation from './Simulation'
import NEAT from 'neataptic'
import ASYNC from 'async'
import _ from 'lodash'
import * as PIXI from 'pixi.js'
import * as Chart from 'chart.js'

export default {
  name: 'HelloWorld',
  components: {Simulation},
  mounted: function () {
    let chartCanvas = document.getElementById('chart').getContext('2d')
    this.chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Fitness',
          data: []
        }]
      },
      options: {
        animation: false
      }
    })

    this.neat = new NEAT.Neat(
      18,
      2,
      null,
      {
        popsize: 8,
        mutation: NEAT.methods.mutation.ALL,
        elitism: 2,
        mutationRate: 0.3,
        network: new NEAT.architect.Random(18, 10, 2)
      }
    )
    console.log(NEAT)

    console.log('Loading assets')
    const t = this
    const afterLoad = function () {
      console.log('Loaded')
      function update (dt) {
        t.$children.forEach((container) => container.simulation.update(dt))
      }
      setInterval(() => update(1000.0 / 30), 1000.0 / 30)
      const neat = t.neat
      ASYNC.forever(
        function (next) {
          // Split to chunks
          const chunks = _.toArray(_.chunk(neat.population, neat.population.length / t.$children.length))
          ASYNC.eachOf(chunks,
            async function (chunk, index, callback) {
              for (let i in chunk) {
                // noinspection JSUnfilteredForInLoop
                chunk[i].score = await t.$children[index].simulation.evaluate(chunk[i])
              }
              callback()
            },
            function () {
              neat.sort()

              // From https://wagenaartje.github.io/neataptic/docs/neat/
              let newPopulation = []

              t.chart.data.labels.push(neat.generation)
              t.chart.data.datasets[0].data.push(neat.population[0].score)
              t.chart.update()
              // Elitism
              for (let i = 0; i < neat.elitism; i++) {
                newPopulation.push(neat.population[i])
              }

              // Breed the next individuals
              for (let i = 0; i < neat.popsize - neat.elitism; i++) {
                newPopulation.push(neat.getOffspring())
              }
              delete neat.population
              // Replace the old population with the new population
              neat.population = newPopulation
              neat.mutate()

              neat.generation++
              next()
            })
        }
      )
    }

    PIXI.loader.onComplete.add(afterLoad)

    PIXI.loader
      .add('./static/chassis.png')
      .add('./static/wheel.png')
      .load()
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
#chart {
  display:block;
  margin-left:auto;
  margin-right:auto;
  width: 90%;
}
</style>
