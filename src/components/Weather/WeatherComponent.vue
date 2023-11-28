<template>
    <div class="weather-component__wrapper">
        <city-search-input @sendWeatherData="handleWeatherData" />
        <weather-display v-if="weatherData" :weather-data="weatherData" />
    </div>
</template>

<script>
import CitySearchInput from '@/components/Common/CitySearchInput'
import WeatherDisplay from '@/components/Weather/WeatherDisplay'

export default {
    components: {
        CitySearchInput,
        WeatherDisplay
    },
    data() {
        return {
            weatherData: null
        }
    },
    methods: {
        handleWeatherData(receivedWeatherData) {
            this.weatherData = receivedWeatherData;
        }
    }
}
</script>

<style scoped>
.weather-component__wrapper {
    border: 2px solid;
    border-radius: 5px;
    padding: 30px;
}
</style>
