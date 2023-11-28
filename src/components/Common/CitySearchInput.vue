<template>
   <div class="city-search">
        <custom-modal />
        <div class="city-search__wrap">
            <div class="city-search__input">
                <div class="input__inside-wrap">
                    <input @mousedown="showDropdown" @focus="showDropdown" @blur="hideDropdown" v-model="searchInput" @input="handleInputChange" placeholder="Enter your city name" />
                    <button :disabled="searchInput.length < 2" class="city-search__btn" @click="searchWeather">Search</button>
                </div>
                <ul v-show="dropdownVisible" v-if="searchResults.length > 0 && searchInput.length > 0" class="dropdown exclude-blur">
                    <li class="exclude-blur" v-for="city in searchResults" :key="city.geonameId" @click="selectCity(city)">
                        {{ city }}
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

//TODO: Think about ways to restructure, maybe move logic to parent.
export default {
    components: {
        AddToChosen,
        CustomModal
    },
    props: {
        chosenPage: {
            type: Boolean,
            default: false
        },
        componentIndex: {
            type: Number,
            default: null
        },
        currentUsersCity: {
            type: String,
            default: null
        }
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
            setTimeout(() => this.dropdownVisible = false, 300)
        },
        showDropdown() {
            this.dropdownVisible = true;
        },
        openModal(data) { // TODO: Make it global later
            this.$emit('open-modal', data);
        },
        async handleInputChange() {
            const options = {
                method: 'GET',
                url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
                params: { namePrefix: this.searchInput },
                headers: {
                    'X-RapidAPI-Key': 'd0019c55e3msh09ebf5eb98ff5c0p18c47bjsn2601faa7685e',
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                this.searchResults = response.data.data.map((e) => e.city);
                console.log(this.searchResults)
            } catch (error) {
                this.openModal('Seems something went wrong');
            }

            // Rewrote for other api due to work of Github Pages

            // try {
            //     const response = await axios.get(
            //         `http://api.geonames.org/searchJSON?q=${encodeURIComponent(this.searchInput)}&maxRows=10&username=feathertest1`
            //     );
            //     this.searchResults = response.data.geonames;
            // } catch (error) {
            //     this.openModal('Seems something went wrong');
            // }
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
            this.chosenCities.push(this.componentIndex === 0 && !this.chosenPage && !this.searchedCity ? this.currentUsersCity : this.searchedCity);
            localStorage.setItem('chosenCities', JSON.stringify(this.chosenCities));
        },
         searchWeather() {
            const apiKey = 'd5c10c96e44dec1bad116a142f8a817c';
            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
                this.searchInput
             )}&units=metric&appid=${apiKey}`;

            axios.get(weatherApiUrl)
                .then(response => {
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
    mounted() {
        !this.chosenPage && this.componentIndex === 0 ? this.isSearchValid = true : this.isSearchValid = false
    }
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
