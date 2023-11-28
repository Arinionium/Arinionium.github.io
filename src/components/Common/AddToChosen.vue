<template>
    <div>
        <button :disabled="disabled" :class="{'_disabled': disabled}" v-if="!isChosen" @click.stop="addToChosen">
            <i class="fas fa-plus"></i> Add to Chosen
        </button>
        <button class="chosen" v-if="isChosen" @click.stop="removeFromChosen">
            <i class="fas fa-minus"></i> Added to Chosen!
        </button>
    </div>
</template>

<script>
export default {
    props: {
        isChosen: Boolean,
        disabled: Boolean
    },
    methods: {
        addToChosen() {
            this.$emit('addToChosen');
        },
        removeFromChosen() {
            this.$emit('removeFromChosen');
        },
    },
};
</script>

<style scoped>
button {
    background-color: transparent;
    color: #000;
    border: 2px solid;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
}

button:hover,
button.chosen {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    color: #fff;
}

button._disabled {
    opacity: 0.3;
}
</style>
