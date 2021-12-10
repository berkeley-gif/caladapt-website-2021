import config from "~/helpers/api-config";
import { cosmosLookup } from "./_cosmos-look-up";

const {
  env: {
    production: { tileURL },
  },
} = config;

export const getTileUrlCalflod3d = (
  source,
  scenario,
  timeFrame,
  region,
  color
) =>
  `${tileURL}/${source}_${scenario}_${timeFrame}_mosaic_${region}/{z}/{x}/{y}.png?style=${color}`;

export const getTileUrlCosmos = (timeFrame, scenario, color = "rsgreen") => {
  const id = `${timeFrame}|${scenario}`;
  const slug = cosmosLookup.get(id);
  if (slug) {
    return `https://api.cal-adapt.org/tiles/${slug}/{z}/{x}/{y}.png?style=${color}`;
  } else {
    console.error(`cosmos tile slug not found for ${id}`);
  }
};

export const getTileUrl = (source, scenario, timeFrame, ...rest) =>
  source === "cosmos"
    ? getTileUrlCosmos(timeFrame, scenario)
    : getTileUrlCalflod3d(source, scenario, timeFrame, ...rest);
