import * as PIXI from 'pixi.js'
import * as CES from 'ces'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  setCanvas: function (canvas) {
    this.renderer = new PIXI.Application({
      view: canvas
    })
  },
  addedToWorld: function (world) {
    world.entityAdded('graphics').add((entity) => {
      this.renderer.stage.addChild(entity.getComponent('graphics').container)
    })
  },
  update: function (dt) {
    this.renderer.render()
  }
})
