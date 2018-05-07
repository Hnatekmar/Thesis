// noinspection JSFileReferences
import GraphicsComponent from '@/simulation/components/graphics.js'
import * as PIXI from 'pixi.js'

describe('graphics component', () => {
  it('should have no children when none are specified', () => {
    expect(new GraphicsComponent([]).container.children.length).toBe(0)
  })
  it('should have same ammount of children that are specified in constructor', () => {
    expect(new GraphicsComponent([new PIXI.Graphics(), new PIXI.Graphics()]).container.children.length).toBe(2)
  })
})
