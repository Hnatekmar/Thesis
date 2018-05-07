import * as CES from 'ces'
import * as PIXI from 'pixi.js'

/**
 * Light wrapper around PIXI.Container
 */
export default CES.Component.extend({
  name: 'graphics',
  /**
   * Constructor
   * @param objects - array of PIXI.DisplayObject
   */
  init: function (objects) {
    this.container = new PIXI.Container()
    objects.forEach((object) => this.container.addChild(object))
  }
})
