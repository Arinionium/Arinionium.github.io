import Vue from 'vue'
import App from './App.vue'
import router from './router';
import './assets/css/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'chartjs-adapter-date-fns';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
