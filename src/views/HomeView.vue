<template>
  <div>
    <map-view v-if="center" :center="center"></map-view>
  </div>
</template>

<script>
import MapView from "../components/MapView.vue";
export default {
  components: { MapView },

  data: () => ({
    center: null,
  }),

  created() {
    this.getInitialLocation();
  },

  methods: {
    async getInitialLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.center = [coords.longitude, coords.latitude];
        },
        (error) => {
          // TODO: Set default location in environment file
          this.center = [0, 0];
        }
      );
    },
  },
};
</script>
