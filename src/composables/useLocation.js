import { onMounted, ref, watch } from "vue";
import mapboxgl from "mapbox-gl";

import environment from "../environment";
import directionApi from "../apis/directionApi";

export const useLocation = (props) => {
  const map = ref(null);
  const markerDestination = ref(null);
  const center = ref([0, 0]);

  const createMap = () => {
    // Showing map
    map.value = new mapboxgl.Map({
      ...environment.mapbox,
      center: [...center.value],
    });

    //   Setting the user location popup
    let userLocationPopup = new mapboxgl.Popup()
      .setHTML(`<h4>Estas aqui</h4>`)
      .addTo(map.value);

    // Setting the user location marker
    createMarker({
      lng: center.value[0],
      lat: center.value[1],
      popup: userLocationPopup,
    });

    // Adding mapbox events
    map.value.on("click", (e) => {
      createDestinationMarker(e);
    });
  };

  const createDestinationMarker = (event) => {
    //   Delete actual marker
    if (markerDestination.value) markerDestination.value.remove();

    console.log({
      lng: event.lngLat.lng,
      lat: event.lngLat.lat,
    });

    //   Create new marker
    markerDestination.value = createMarker({
      lng: event.lngLat.lng,
      lat: event.lngLat.lat,
      color: "#2B01FF",
    });

    getDirection({
      initLng: event.lngLat.lng,
      initLat: event.lngLat.lat,
      endLng: center.value[0],
      endLat: center.value[1],
    });
  };

  const getDirection = async ({ initLng, initLat, endLng, endLat }) => {
    if (map.value.getLayer("route")) {
      map.value.removeLayer("route");
      map.value.removeSource("route");
    }

    const response = await directionApi.get(
      `/${initLng}%2C${initLat}%3B${endLng}%2C${endLat}`
    );

    // console.log(response.data);
    setRoutePolyline(response.data.routes[0].geometry.coordinates);
  };

  const setRoutePolyline = (coords) => {
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

    map.value.addSource("route", sourceData);
    map.value.addLayer({
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
  };

  const createMarker = ({
    lng = "-89.2894733",
    lat = "13.6757837",
    color = "#b40219",
    popup = null,
  }) => {
    return new mapboxgl.Marker({ color: color })
      .setLngLat({
        lng: lng,
        lat: lat,
      })
      .setPopup(popup)
      .addTo(map.value);
  };

  const getUserLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        center.value = [coords.longitude, coords.latitude];
        // console.log(center.value);
      },
      (error) => {
        // TODO: Set default location in environment file
        center.value = [0, 0];
      }
    );
  };

  onMounted(async () => {
    getUserLocation();
  });

  watch(center, () => {
    createMap();
  });

  return {
    // Variables
    map,
    markerDestination,

    // Functions
    createMap,
    createDestinationMarker,
    getDirection,
    setRoutePolyline,
    createMarker,
    getUserLocation,
  };
};

export default useLocation;
