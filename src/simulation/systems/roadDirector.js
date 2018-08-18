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
          Wall(200, 0, 10, 1200, this.world)
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
          Wall(200, 0, 10, 1200, this.world)
        ]),
        'possibleParts': {
          'up': ['Cross', 'T'],
          'down': ['Cross', 'T'],
          'left': ['Cross', 'T'],
          'right': ['Cross', 'T']
        }
      }
    }
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
    let possiblePieces = this.currentPart['possibleParts']
    if (possiblePieces.length === 0) return
    this.currentPart['group'].moveAbsolute(90000000, 900000)
    this.currentPart = this.parts[possiblePieces[Math.floor(Math.random() * possiblePieces.length)]]
    this.currentPart['group'].moveAbsolute(0, 0)
    this.moveCarBackToScreen(direction)
  },
  moveCarBackToScreen: function (direction) {
    let body = this.car.getComponent('physics').body
    let newPos = [0, 0]
    if (direction === 'up') {
      newPos = [body.position[0], 0]
    } else if (direction === 'down') {
      newPos = [body.position[0], 1200]
    } else if (direction === 'left') {
      newPos = [1200, body.position[1]]
    } else if (direction === 'right') {
      newPos = [0, body.position[1]]
    }
    body.position = newPos
  },
  update: function (dt) {
    if (this.currentPart === null) {
      this.currentPart = this.parts['T']
    }
    let pos = this.getCarPosition()
    if (pos !== null) {
      let x = pos[0]
      let y = pos[1]
      let direction = getDirection(x, y, 1200, 1200)
      if (direction !== 'onScreen') {
        this.swapNextRoadPart(direction)
      }
    }
  }
})
