<template>
    <div class="weather-component__wrap">
        <button @click="deleteComponent" class="delete-btn">
            <i class="fa fa-trash-can"></i>
        </button>
        <div class="weather-component__inside-wrap">
            <city-search-input @sendWeatherData="handleWeatherData" />
            <weather-display v-if="weatherData" :weather-data="weatherData" />
        </div>
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
        },
        deleteComponent() {
            this.$emit('delete-component');
        }
    }
}
</script>

<style scoped>
.weather-component__wrap {
    border: 2px solid;
    border-radius: 5px;
}

.delete-btn {
    display: block;
    margin-left: auto;
    padding: 10px 10px 0 0;
    font-size: 16px;
    background-color: transparent;
}

.weather-component__inside-wrap {
    padding: 15px 30px 30px;
}
</style>
