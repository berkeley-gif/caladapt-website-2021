import config from "~/helpers/api-config";

const {
  env: {
    production: { tileURL },
  },
} = config;

export const getTileUrlCalflod3d = (scenario, timeFrame, color) =>
  `${tileURL}/calflod3dtfs_mosaic_${scenario}_${timeFrame}_sfbay/{z}/{x}/{y}.png?style=${color}`;

// "https://api.cal-adapt.org/tiles/calflod3dtfs_mosaic_med_2020-2040_sfbay/{z}/{x}/{y}.png",
// "https://api.cal-adapt.org/tiles/calflod3dtfs_mosaic_med_2020-2040_sfbay/10/161/397.png?style=rsblue"

export const getTileUrl = (source, scenario, timeFrame, region, color) =>
  `https://api.cal-adapt.org/tiles/${source}_mosaic_${scenario}_${timeFrame}_${region}/{z}/{x}/{y}.png?style=${color}`;
