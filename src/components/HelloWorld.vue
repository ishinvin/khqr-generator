<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="sora">{{ msg }}</h1>
    <h3>A Simple QR Generator for testing KHQR Payment.</h3>
    <!-- <p class="pt-4">Made with <span class="text-primary">♥</span> by Ishin</p> -->
    <div class="pt-4 sponsors">
      <iframe
        src="https://github.com/sponsors/ishinvin/button"
        title="Sponsor ishinvin"
        height="32"
        width="114"
        style="border: 0; border-radius: 6px"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3,
.greetings p,
.sponsors {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3,
  .greetings p,
  .sponsors {
    text-align: left;
  }
}
</style>
