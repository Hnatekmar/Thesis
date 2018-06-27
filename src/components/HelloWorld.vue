<template>
  <div class="hello">
    <simulation></simulation>
  </div>
</template>

<script>

import Simulation from './Simulation'
import NEAT from 'neataptic'

export default {
  name: 'HelloWorld',
  components: {Simulation},
  mounted: async function () {
    var i = 0
    while (true) {
      console.log('Generation: ' + i)
      await this.$data.neat.evaluate()
      i += 1
    }
  },
  data () {
    const t = this
    return {
      neat: new NEAT.Neat(
        7,
        1,
        async function (genome) {
          return t.$children[0].simulation.evaluate(genome)
        },
        {
          mutation: NEAT.methods.mutation.ALL,
          popsize: 20
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
