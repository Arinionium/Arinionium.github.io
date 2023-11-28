<template>
   <div class="city-search">
        <custom-modal />
        <div class="city-search__wrap">
            <div class="city-search__input">
                <div class="input__inside-wrap">
                    <input @click="showDropdown" @blur="hideDropdown" v-model="searchInput" @input="handleInputChange" placeholder="Enter your city name" />
                    <button :disabled="searchInput.length < 2" class="city-search__btn" @click="searchWeather">Search</button>
                </div>
                <ul v-show="dropdownVisible" v-if="searchResults.length > 0 && searchInput.length > 0" class="dropdown">
                    <li v-for="city in searchResults" :key="city.geonameId" @click="selectCity(city.name)">
                        {{ city.name }}
                    </li>
                </ul>
            </div>
        </div>
        <add-to-chosen :disabled="!isSearchValid" :isChosen="addedToChosen" class="add-to-chosen" @addToChosen="addToChosenCities" />
   </div>
</template>

<script>
import axios from 'axios';
import AddToChosen from './AddToChosen.vue';
import CustomModal from './CustomModal.vue';

export default {
    components: {
        AddToChosen,
        CustomModal
    },
    data() {
        return {
            searchedCity: '',
            searchInput: '',
            searchResults: [],
            chosenCities: JSON.parse(localStorage.getItem('chosenCities')) || [],
            isSearchValid: false,
            addedToChosen: false,
            dropdownVisible: true
        };
    },
    methods: {
        hideDropdown() {
            setTimeout(() => {
                this.dropdownVisible = false
            }, 100);
        },
        showDropdown() {
            this.dropdownVisible = true;
        },
        openModal(data) {
            this.$emit('open-modal', data);
        },
        async handleInputChange() {
            try {
                const response = await axios.get(
                    `http://api.geonames.org/searchJSON?q=${encodeURIComponent(this.searchInput)}&maxRows=10&username=feathertest1`
                );
                this.searchResults = response.data.geonames;
            } catch (error) {
                this.openModal('Seems something went wrong');
            }
        },
        selectCity(cityName) {
            this.searchInput = cityName;
            this.searchResults = [];
        },
        addToChosenCities() {
            if (!this.searchedCity && !this.isSearchValid) return;
            if (this.chosenCities.length > 4) {
                this.openModal(`You have too many chosen cities, delete one or more.`);
                return
            }
            this.addedToChosen = true;
            this.chosenCities.push(this.searchedCity);
            localStorage.setItem('chosenCities', JSON.stringify(this.chosenCities));
        },
         searchWeather() {
            const apiKey = 'd5c10c96e44dec1bad116a142f8a817c';
            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
                this.searchInput
             )}&units=metric&appid=${apiKey}`;

            axios.get(weatherApiUrl)
                .then(response => {
                    console.log('Weather Data:', response.data);
                    this.$emit('sendWeatherData', response.data);
                    this.searchResults = [];
                    this.isSearchValid = true;
                    this.searchedCity = this.searchInput;
                    this.addedToChosen = false;
                })
                .catch(error => {
                    this.openModal(`No results for ${this.searchInput}. Check if city name correct. ${error}`);
                    this.isSearchValid = false;
                });
        },
    },
};
</script>

<style>
.city-search {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.city-search__wrap {
    font-size: 14px;
    width: 300px;
    position: relative;
}

.city-search__input {
    position: relative;
}

.city-search__btn {
    font-size: 14px;
    padding: 10px;
    margin-left: 10px;
    background-color: transparent;
    border: 2px solid;
    border-radius: 5px;
}

.city-search__btn:hover {
    background-color: #000;
    color: #fff;
}

.input__inside-wrap {
    display: flex;
    align-items: center;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: relative;
    z-index: 1;
}

.add-to-chosen {
    width: 20%;
    margin-left: 20px;
}

.dropdown {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 2;
}

.dropdown li {
    padding: 10px;
    cursor: pointer;
}

.dropdown li:hover {
    background-color: #f0f0f0;
}

/* Media query */

@media (max-width: 768px) {
    .city-search__wrap {
        width: 100%;
    }
}
</style>
