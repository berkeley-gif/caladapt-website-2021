import config from "~/helpers/api-config";

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

export const getTileUrlCosmos = (cm = 200, color = "rsgreen") =>
  `https://api.cal-adapt.org/tiles/cosmosflooding_${cm}cm_100yrstorm_mosaic_sfbay/{z}/{x}/{y}.png?style=${color}`;

export const getTileUrl = (source, ...rest) =>
  source === "cosmos"
    ? getTileUrlCosmos()
    : getTileUrlCalflod3d(source, ...rest);
