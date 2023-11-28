<template>
  <div class="weather-page">
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
    <div class="weather-page__wrapper">
      <main class="weather-page__main-wrap">
        <weather-component @delete-component="triggerDeleteComponentModal(index)" class="weather-component" v-for="(component, index) in components" :key="component.hash" />
        <button class="add-component-btn" @click="createNewComponent">
            <i class="fas fa-plus"></i>
        </button>
      </main>
    </div>
  </div>
</template>

<script>
import WeatherComponent from '@/components/Weather/WeatherComponent'
import CustomModal from '@/components/Common/CustomModal'

export default {
  components: {
    WeatherComponent,
    CustomModal
  },
  data() {
    return {
      components: [WeatherComponent],
      indexForDelete: null
    }
  },
  methods: {
    createNewComponent() {
      if (this.components.length < 5){
        this.components.push({component: WeatherComponent, hash: new Date().getTime() });
      } else {
        this.$emit('open-modal', 'You can\'t have more than 5 charts at the same time. Delete one if you want to add new.');
      }
    },
    triggerDeleteComponentModal(index) {
      this.indexForDelete = index;
      this.$emit('open-modal', '');
    },
    deleteComponent() {
      this.components.splice(this.indexForDelete, 1);
      this.$refs.modalRef.closeModal();
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

.modal-delete-btn {
  display: block;
  background-color: transparent;
  border: 2px solid;
  border-radius: 5px;
  margin: 5px auto 0;
  padding: 2px;
}
</style>
