import layers from "../../../helpers/mapbox-layers";
import climvars from "../../../helpers/climate-variables";

export const climvarList = climvars
  .filter((d) => ["tasmax", "tasmin"].includes(d.id))
  .map((d) => {
    const title = d.label;
    return { ...d, title };
  });

export const stationsLayer = layers.find((d) => d.id === "hadisdstations");

// export const classifyTemperatures = (values) => {
//   const sorted = values.sort();
//   return [
//     {
//       label: 'Much Warmer than Average',
//       extent: [quantile(sorted, 0.9), sorted[sorted.length - 1]],
//     },
//     {
//       label: 'Warmer than Average',
//       extent: [quantile(sorted, 0.67), quantile(sorted, 0.9)],
//     },
//     {
//       label: 'Near Average',
//       extent: [quantile(sorted, 0.33), quantile(sorted, 0.67)],
//     },
//     {
//       label: 'Cooler than Average',
//       extent: [quantile(sorted, 0.1), quantile(sorted, 0.33)],
//     },
//     {
//       label: 'Much Cooler than Average',
//       extent: [sorted[0], quantile(sorted, 0.1)],
//     },
//   ];
// }
