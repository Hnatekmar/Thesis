<template>
<canvas class="screen"></canvas>
</template>

<script>
import Simulation from '../simulation/main.js'
export default {
  name: 'Simulation',
  mounted: function () {
    this.simulation = new Simulation(this.$el)
  },
  destroyed: function () {
    this.simulation.destroy()
  }
}
</script>

<style scoped>
.screen {
  width: 100%;
  height: 100%;
  border-style: ridge;
  border-width: 1px;
}
</style>
