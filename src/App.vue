<template>
  <div id="app">
    <div class="container">
      <app-header />
      <router-view/>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/Common/AppHeader'

export default {
  components: {
    AppHeader
  }
}
</script>