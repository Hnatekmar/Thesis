<template>
  <div class="hello">
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

export default {
  name: 'HelloWorld',
  components: {Simulation},
  mounted: function () {
    const t = this

    this.neat = new NEAT.Neat(
      10,
      2,
      null,
      // async function (genome) {
      //   return t.$children[0].simulation.evaluate(genome)
      // },
      {
        mutation: NEAT.methods.mutation.ALL,
        popsize: 8 // ,
        // network: new NEAT.architect.Random(
        //   8,
        //   25,
        //   2
        // )
      }
    )

    function update (dt) {
      t.$children.forEach((container) => container.simulation.update(dt))
      requestAnimationFrame(update)
    }

    PIXI.loader
      .add('./static/chassis.png')
      .add('./static/wheel.png')
      .load()

    requestAnimationFrame(update)
    const neat = t.neat
    const chunks = _.toArray(_.chunk(neat.population, neat.population.length / t.$children.length))
    ASYNC.forever(
      function (next) {
        // Split to chunks
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
</style>
