import Vue from 'vue'
import Router from 'vue-router'
import Realtime from '@/components/Realtime'
import Player from '@/components/Player'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Realtime',
      component: Realtime
    },
    {
      path: '/player/',
      name: 'Player',
      component: Player
    }
  ]
})
