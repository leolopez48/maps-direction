<template>
  <div id="map" style="" ref="map"></div>
</template>

<script>
import directionApi from "../apis/directionApi";
import mapboxgl from "mapbox-gl";
import environment from "../environment";

export default {
  data: () => ({
    map: null,
    markerDestination: null,
  }),

  props: {
    center: {
      type: Array,
      default: () => [0, 0],
    },
  },
  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      // Showing map
      this.map = new mapboxgl.Map({
        ...environment.mapbox,
        center: [...this.center],
      });

      //   Setting the user location popup
      const userLocationPopup = new mapboxgl.Popup()
        .setHTML(`<h4>Estas aqui</h4>`)
        .addTo(this.map);

      // Setting the user location marker
      this.createMarker({
        lng: this.center[0],
        lat: this.center[1],
        popup: userLocationPopup,
      });

      // Adding mapbox events
      this.map.on("click", (e) => {
        this.createDestinationMarker(e);
      });
    },

    createDestinationMarker(event) {
      //   console.log(this.markerDestination);
      //   Delete actual marker
      if (this.markerDestination) this.markerDestination.remove();

      console.log({
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
      });

      //   {lng: -89.29834692175879, lat: 13.683817422701537}

      //   Create new marker
      this.markerDestination = this.createMarker({
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
        color: "#2B01FF",
      });

      this.getDirection({
        initLng: event.lngLat.lng,
        initLat: event.lngLat.lat,
        endLng: this.center[0],
        endLat: this.center[1],
      });
    },

    async getDirection({ initLng, initLat, endLng, endLat }) {
      if (this.map.getLayer("route")) {
        this.map.removeLayer("route");
        this.map.removeSource("route");
      }

      const response = await directionApi.get(
        `/${initLng}%2C${initLat}%3B${endLng}%2C${endLat}`
      );

      // console.log(response.data);
      this.setRoutePolyline(response.data.routes[0].geometry.coordinates);
    },

    setRoutePolyline(coords) {
      //   console.log(coords);
      const start = coords[0];
      const end = coords[coords.length - 1];

      //   console.log([start[0], start[1]], [end[0], end[1]]);
      //   Taking the limits
      const bounds = new mapboxgl.LngLatBounds(
        [start[0], start[1]],
        [end[0], end[1]]
      );
      //   for (const coord of coords) {
      //     const newCoord = [coord[0], coord[1]];
      //     bounds.extend(newCoord);
      //   }
      //   Adding padding
      //   this.map.fitBounds(bounds, {
      //     padding: 300,
      //   });
      const sourceData = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coords,
              },
            },
          ],
        },
      };

      this.map.addSource("route", sourceData);
      this.map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#84846E",
          "line-width": 5,
          "line-opacity": 1,
        },
      });
    },

    createMarker({
      lng = "-89.2894733",
      lat = "13.6757837",
      color = "#b40219",
      popup = null,
    }) {
      return new mapboxgl.Marker({ color: color })
        .setLngLat({
          lng: lng,
          lat: lat,
        })
        .setPopup(popup)
        .addTo(this.map);
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 96.5vh;
}
</style>
