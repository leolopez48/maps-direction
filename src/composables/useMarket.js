import { ref } from "vue";

export const useMarket = () => {
  const markets = ref([
    {
      id: 1,
      name: "Proceres",
      longitude: -180,
      latitude: -180,
    },
  ]);

  return {
    markets,
  };
};
