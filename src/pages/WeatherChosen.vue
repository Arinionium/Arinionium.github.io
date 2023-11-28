<template>
    <div class="weather-chosen">
        <custom-modal ref="modalRef">
            <div>
            <div>
              Are you sure that you want to delete this component?
            </div>
            <button @click="deleteComponent" class="modal-delete-btn">
                Yes
            </button>
          </div>
        </custom-modal>
        <weather-component class="weather-component" @delete-chosen-component="triggerDeleteComponentModal" :componentIndex="index"  :chosenPage="true" :chosenCity="weatherCity" v-for="(weatherCity, index) in weatherComponents" :key="index.toString() + weatherCity" :displayInput="false"/>
        <div class="empty-chosen-page" v-if="showEmptyPage">
            <span>Seems you don't have Chosen cities at that moment</span>
        </div>
    </div>
</template>

<script>
import WeatherComponent from '@/components/Weather/WeatherComponent.vue'
import CustomModal from '@/components/Common/CustomModal.vue'

export default {
    name: 'WeatherChosen',
    components: {
        WeatherComponent,
        CustomModal
    },
    data() {
        return {
            weatherComponents: [],
            showEmptyPage: false,
            indexForDelete: null
        }
    },
    methods: {
        triggerDeleteComponentModal(index) {
            this.indexForDelete = index;
            this.$emit('open-modal', '');
        },
        deleteComponent() {
            const storedData = localStorage.getItem('chosenCities');
            const chosenCities = JSON.parse(storedData);
            chosenCities.splice(this.indexForDelete, 1);
            this.weatherComponents = chosenCities;

            !this.weatherComponents.length ? this.showEmptyPage = true : this.showEmptyPage = false;

            localStorage.setItem('chosenCities', JSON.stringify(chosenCities));
            this.$refs.modalRef.closeModal();
        }
    },
    beforeMount() {
        let storedData = localStorage.getItem('chosenCities');

        if (storedData) {
            this.weatherComponents = JSON.parse(storedData);
        } else {
            this.showEmptyPage = true;
        }
    }
}
</script>

<style scoped>
.weather-component {
    margin-bottom: 20px;
}

.weather-chosen {
    padding-bottom: 20px;
}

.empty-chosen-page {
    text-align: center;
    font-size: 26px;
    margin: 100px 0;
    font-weight: 700;
}

.modal-delete-btn {
  display: block;
  background-color: transparent;
  border: 2px solid;
  border-radius: 5px;
  margin: 5px auto 0;
  padding: 2px;
}
</style>