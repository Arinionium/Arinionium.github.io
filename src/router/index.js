import Vue from 'vue'
import VueRouter from 'vue-router'
import WeatherPage from '@/pages/WeatherPage'
import WeatherChosen from '@/pages/WeatherChosen'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Weather page', component: WeatherPage },
  { path: '/chosen',  name: 'Chosen page', component: WeatherChosen }
]

const router = new VueRouter({
  routes
})

export default router
