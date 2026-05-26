<template>
  <Navbar v-if="route.name !== 'login' && route.name !== 'register'" />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue';

const route = useRoute();
</script>

<style>
:root {
  --color1: #cccfe0;
  --color2: #2e3440;
  --color3: #272b35;
  --color4: #1e2229;
  --color5: #e5e9f0;
}

* {
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-style: normal;
  box-sizing: border-box;
}

body {
  background-color: var(--color4);
  margin: 0;
  color: var(--color5);
}

h1 {
  color: var(--color3);
  margin-bottom: 0.5em;
}
</style>