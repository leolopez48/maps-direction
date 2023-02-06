import axios from "axios";
import environment from "../environment";

const directionApi = axios.create({
  baseURL: "https://api.mapbox.com/directions/v5/mapbox/driving",
  params: {
    alternatives: false,
    geometries: "geojson",
    language: "es",
    overview: "simplified",
    steps: true,
    continue_straight: false,
    access_token: environment.mapBoxAccessToken,
  },
});

export default directionApi;
