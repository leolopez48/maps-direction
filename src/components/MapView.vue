<template>
  <div id="map" style="" ref="map"></div>
</template>

<script setup>
import useLocation from "../composables/useLocation";

useLocation();
</script>

<style scoped>
* {
  z-index: 0;
}

#map {
  width: 100%;
  height: 96.5vh;
}
</style>
