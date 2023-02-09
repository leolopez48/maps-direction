<template>
  <map-view />
</template>

<script setup>
import MapView from "../components/MapView.vue";
import useLocation from "../composables/useLocation";

const { map } = useLocation();
</script>
