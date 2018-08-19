import * as CES from 'ces'
import Wall from '../entities/wall.js'
import RoadPart from '../entities/roadPart.js'

function getDirection (x, y, w, h) {
  if (x >= w) return 'right'
  if (y >= h) return 'up'
  if (x < 0) return 'left'
  if (y < 0) return 'down'
  return 'onScreen'
}

export default CES.System.extend({
  setWorld: function (world) {
    this.world = world
    this.parts = {
      'T': {
        'group': RoadPart(0, 0, this.world, [
          Wall(250, 700, 20, 400, this.world),
          Wall(550, 700, 20, 400, this.world),
          Wall(125, 500, 250, 20, this.world),
          Wall(675, 500, 250, 20, this.world),
          Wall(400, 200, 800, 20, this.world)
        ]),
        'possibleParts': {
          'up': [],
          'down': ['Cross'],
          'left': ['Cross', 'T'],
          'right': ['Cross', 'T']
        }
      },
      'Cross': {
        'group': RoadPart(0, 0, this.world, [
          Wall(675, 500, 250, 20, this.world),
          Wall(125, 500, 250, 20, this.world),
          Wall(675, 250, 250, 20, this.world),
          Wall(125, 250, 250, 20, this.world),
          Wall(250, 50, 20, 400, this.world),
          Wall(550, 50, 20, 400, this.world),
          Wall(250, 700, 20, 400, this.world),
          Wall(550, 700, 20, 400, this.world)
        ]),
        'possibleParts': {
          'up': ['Cross', 'T'],
          'down': ['Cross', 'T'],
          'left': ['Cross', 'T'],
          'right': ['Cross', 'T']
        }
      }
    }
    Object.keys(this.parts).forEach((key) => {
      if (key !== 'Cross') {
        this.parts[key]['group'].moveAbsolute(Math.sin(Math.random()) * 50000, Math.cos(Math.random()) * 50000)
      }
    })
  },
  reset: function () {
    this.currentPart['group'].moveAbsolute(Math.sin(Math.random()) * 50000, Math.cos(Math.random()) * 50000)
    this.currentPart = this.parts['Cross']
    this.currentPart['group'].moveAbsolute(0, 0)
  },
  setCar: function (car) {
    this.car = car
  },
  getCarPosition: function () {
    if (this.car != null) {
      let body = this.car.getComponent('physics').body
      return body.position
    }
    return null
  },
  swapNextRoadPart: function (direction) {
    if (this.currentPart === undefined) return
    let possiblePieces = this.currentPart['possibleParts'][direction]
    if (possiblePieces.length === 0) return
    this.currentPart['group'].moveAbsolute(Math.sin(Math.random()) * 50000, Math.cos(Math.random()) * 50000)
    this.currentPart = this.parts[possiblePieces[Math.floor(Math.random() * possiblePieces.length)]]
    this.currentPart['group'].moveAbsolute(0, 0)
    this.moveCarBackToScreen(direction)
  },
  moveCarBackToScreen: function (direction) {
    let body = this.car.getComponent('physics').body
    this.car.getComponent('car').fitness *= 1.2
    let newPos = [0, 0]
    if (direction === 'up') {
      newPos = [body.position[0], 0]
    } else if (direction === 'down') {
      newPos = [body.position[0], 800]
    } else if (direction === 'left') {
      newPos = [800, body.position[1]]
    } else if (direction === 'right') {
      newPos = [0, body.position[1]]
    }
    body.position = newPos
  },
  update: function (dt) {
    if (this.currentPart === undefined) {
      this.currentPart = this.parts['Cross']
    }
    let pos = this.getCarPosition()
    if (pos !== null) {
      let x = pos[0]
      let y = pos[1]
      let direction = getDirection(x, y, 800, 800)
      if (direction !== 'onScreen') {
        this.swapNextRoadPart(direction)
      }
    }
  }
})
