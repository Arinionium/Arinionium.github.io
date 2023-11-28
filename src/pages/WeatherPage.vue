<template>
  <div class="weather-page">
    <div class="weather-page__wrapper">
      <main class="weather-page__main-wrap">
        <weather-component class="weather-component"/>
        <weather-component class="weather-component" v-for="(component, index) in components" :key="index" />
        <button class="add-component-btn" @click="createNewComponent">
            <i class="fas fa-plus"></i>
        </button>
      </main>
    </div>
  </div>
</template>

<script>
import WeatherComponent from '@/components/Weather/WeatherComponent'

export default {
  components: {
    WeatherComponent
  },
  data() {
    return {
      components: []
    }
  },
  methods: {
    createNewComponent() {
      if (this.components.length < 4){
        this.components.push(WeatherComponent);
      } else {
        console.log('modal')
      }
    }
  }
}
</script>

<style scoped>
.weather-component {
  margin-bottom: 20px;
}

.add-component-btn {
  margin: 0 auto;
  display: block;
  padding: 17px 19px;
  border: 2px solid;
  background-color: transparent;
}

.add-component-btn i {
  font-size: 20px;
}

.add-component-btn:hover {
  background-color: #000;
}

.add-component-btn:hover i {
  color: #fff;
}
</style>
