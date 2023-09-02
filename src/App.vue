<script setup lang="ts">
import { RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="KHQR Generator" />

      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav> -->
    </div>
  </header>

  <main class="content-wrapper">
    <div class="w-full">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

header .wrapper {
  margin-bottom: 50px;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--primary-color);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: var(--color-text);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    max-height: 100vh;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }

  .content-wrapper {
    border-left: 1px solid var(--color-border);
    padding: 16px 16px 32px 16px;
    overflow-y: scroll;
    place-items: center;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
