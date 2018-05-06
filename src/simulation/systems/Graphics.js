import * as PIXI from 'pixi.js'
import * as CES from 'ces'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  setCanvas: function (canvas) {
    this.renderer = new PIXI.Application({
      view: canvas
    })
  },
  update: function (dt) {
    this.renderer.render()
  }
})
