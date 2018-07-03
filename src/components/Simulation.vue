<template>
  <div>
    <canvas class="screen"></canvas>
    <div class="visualization"></div>
  </div>
</template>

<script>
import Simulation from '../simulation/main.js'
export default {
  name: 'Simulation',
  mounted: function () {
    this.simulation = new Simulation(this.$el.children[0], 30 * 5, this.$el.children[1])
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
.visualization {
  width: 200px;
  height: 200px;
}
</style>
