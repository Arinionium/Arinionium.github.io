<template>
    <div class="modal-overlay" v-if="showModal">
        <div class="modal">
            <div class="modal__content">
                <div class="modal__main-part">
                    {{ passedData }}
                </div>
                <div v-if="isSlotVisible" class="modal-slot">
                    <slot></slot>
                </div>
                <div class="close-modal" @click="closeModal"><i class="fas fa-times"></i></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showModal: false,
            passedData: null,
            isSlotVisible: true
        };
    },
    methods: {
        openModal(data) {
            this.passedData = data;
            this.passedData ? this.isSlotVisible = false : this.isSlotVisible = true;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
    },
     created() {
        this.$parent.$on('open-modal', this.openModal);
    },
    beforeDestroy() {
        this.$parent.$off('open-modal', this.openModal);
    },
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(41, 39, 39, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.modal {
    background: #fff;
    padding: 20px;
    border: 2px solid;
    border-radius: 5px;
    max-width: 400px;
    width: 100%;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.modal__content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.close-modal {
    padding-left: 15px;
    cursor: pointer;
}

.close-modal i {
    font-size: 18px;
}
</style>