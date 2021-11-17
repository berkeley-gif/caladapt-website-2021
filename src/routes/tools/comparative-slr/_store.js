import { makeCustomWritableStore } from "../_common/stores";

export const floodScenarioStore = makeCustomWritableStore("max", {
  name: "floodScenarioStore",
});

export const timeFrameStore = makeCustomWritableStore([2020, 2040], {
  name: "timeFrameStore",
  getters: [
    {
      name: "label",
      getter: ($s) => (Array.isArray($s) ? $s.join("–") : ""),
    },
  ],
});

export const dataLayersStore = makeCustomWritableStore(
  ["CosMoS", "CalFlod3D"],
  {
    name: "dataLayersStore",
  }
);
