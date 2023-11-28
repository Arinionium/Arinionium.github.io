<template>
    <div class="weather-component__wrap">
        <custom-modal/>
        <button @click="deleteComponent" class="delete-btn">
            <i class="fa fa-trash-can"></i>
        </button>
        <div class="weather-component__inside-wrap">
            <city-search-input :componentIndex="componentIndex" :currentUsersCity="currentUsersCity" :chosenPage="chosenPage" v-if="displayInput" @sendWeatherData="handleWeatherData" />
            <div class="load-spinner__wrap" v-if="displayLoadSpinner">
             <loading-spinner/>  
            </div>
            <weather-display v-if="weatherData" :weather-data="weatherData" />
        </div>
    </div>
</template>

<script>
import CitySearchInput from '@/components/Common/CitySearchInput'
import WeatherDisplay from '@/components/Weather/WeatherDisplay'
import CustomModal from '../Common/CustomModal.vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue';
import axios from 'axios'

export default {
    components: {
        CitySearchInput,
        WeatherDisplay,
        CustomModal,
        LoadingSpinner
    },
    props: {
        displayInput: {
            type: Boolean,
            default: true
        },
        chosenCity: {
            type: String,
            default: null
        },
        chosenPage:  {
            type: Boolean,
            default: false
        },
        componentIndex: {
            type: Number,
            default: null
        },
    },
    data() {
        return {
            weatherData: null,
            displayLoadSpinner: false,
            currentUsersCity: null
        }
    },
    methods: {
        handleWeatherData(receivedWeatherData) {
            this.weatherData = receivedWeatherData;
        },
        deleteComponent() {
            if(this.chosenPage) this.$emit('delete-chosen-component', this.componentIndex);
            this.$emit('delete-component');
        },
         async getCurrentUsersCity() {
            const API_KEY = '436cd60a69bf64';

            try {
                const response = await axios.get(`https://ipinfo.io?token=${API_KEY}`);
                const { city } = response.data;
                
                return city;
            } catch (error) {
                console.error('Error fetching geolocation data:', error.message);
                return null;
            }
        },
        async getChosenCity() {
            const apiKey = 'd5c10c96e44dec1bad116a142f8a817c';

            this.displayLoadSpinner = true;

            try {
                this.currentUsersCity = await this.getCurrentUsersCity();
                const city = !this.chosenPage && this.componentIndex === 0 ? this.currentUsersCity : this.chosenCity

                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
                    city
                )}&units=metric&appid=${apiKey}`;

                const response = await axios.get(weatherApiUrl);
                this.displayLoadSpinner = false;
                this.weatherData = response.data;
            } catch (error) {
                this.$emit(
                    'open-modal',
                    `Seems something went wrong. We will check what could be the issue. ${error}`
                );
            }
        },
    },
    created() {
        if (this.componentIndex === 0 || this.chosenPage) this.getChosenCity();
    },
};
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

.load-spinner__wrap {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
