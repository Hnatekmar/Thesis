<template>
  <canvas class="screen"></canvas>
</template>

<script>
import SimulationEngine from 'thesis-simulation'
import * as PIXI from 'pixi.js'
export default {
  name: 'Simulation',
  mounted: function () {
    this.simulation = new SimulationEngine(60, this.$el, PIXI.loader)
  }
}
</script>

<style scoped>
.screen {
  will-change: transform;
  width: 20%;
  height: 20%;
  border-style: ridge;
  border-width: 1px;
}
</style>
