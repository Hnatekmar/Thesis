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

export default {
  name: 'HelloWorld',
  components: {Simulation},
  mounted: function () {
    const t = this
    ASYNC.forever(
      function (next) {
        // Split to chunks
        const neat = t.$data.neat
        const chunks = _.chunk(t.$data.neat.population, neat.population.length / t.$children.length)
        console.log(chunks.length)
        ASYNC.eachOf(chunks,
          async function (chunk, index, callback) {
            for (let i in chunk) {
              // noinspection JSUnfilteredForInLoop
              chunk[i].score = await t.$children[index].simulation.evaluate(chunk[i])
              console.log(chunk[i].score)
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
      numberOfEvaluators: 8,
      neat: new NEAT.Neat(
        8,
        2,
        null,
        // async function (genome) {
        //   return t.$children[0].simulation.evaluate(genome)
        // },
        {
          mutation: NEAT.methods.mutation.ALL,
          popsize: 8
          // network: new NEAT.architect.Random(
          //   8,
          //   50,
          //   2
          // )
        }
      )
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
