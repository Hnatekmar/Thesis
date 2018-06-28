<template>
<canvas class="screen"></canvas>
</template>

<script>
import Simulation from '../simulation/main.js'
export default {
  name: 'Simulation',
  mounted: function () {
    this.simulation = new Simulation(this.$el, 60 * 10)
  }
}
</script>

<style scoped>
.screen {
  width: 20%;
  height: 20%;
  border-style: ridge;
  border-width: 1px;
}
</style>
