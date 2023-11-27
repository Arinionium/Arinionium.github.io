<template>
   <header class="header">
        <div class="logo-wrap">
            <router-link to="/">
            <img class="logo" :src="require('@/assets/owl-logo.jpg')" alt="site logo (miny owl)">
            </router-link>
        </div>
        <h1 class="site-name">Feather Weather</h1>
        <nav>
            <router-link to="/">Weather page</router-link> |
            <router-link to="/chosen">Chosen page</router-link>
        </nav>
    </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.logo-wrap {
  width: 100px;
  height: 100px;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.site-name {
  text-transform: capitalize;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

nav {
  padding: 0 20px 20px 20px;
}

nav a {
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-exact-active {
  font-weight: 700;
}

nav a:not(.router-link-exact-active):hover {
   text-decoration: underline;
}
</style>