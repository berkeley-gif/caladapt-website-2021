import layers from "../../../helpers/mapbox-layers";
import climvars from "../../../helpers/climate-variables";

export const climvarList = climvars
  .filter((d) => ["tasmax", "tasmin"].includes(d.id))
  .map((d) => {
    const title = d.label;
    return { ...d, title };
  });

export const stationsLayer = layers.find((d) => d.id === "hadisdstations");
