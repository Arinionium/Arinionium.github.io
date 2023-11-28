<template>
    <div class="loading-spinner">
        <img src="@/assets/spinner.svg" alt="loading-spinner">
    </div>
</template>

<script>

export default {
    name: 'LoadingSpinner',
};
</script>

<style scoped>
.loading-spinner img {
    display: block;
    width: 75px;
    height: 75px;
}
</style>
