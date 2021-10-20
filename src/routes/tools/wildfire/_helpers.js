import config from "~/helpers/api-config";
import { getMapOverlayImgURL } from "./_getOverlayUrl";

const { apiEndpoint } = config.env.production;

export { getMapOverlayImgURL };

export const getMapImages = ({
  climvarId,
  modelId,
  years,
  duration,
  scenarioId,
  monthNumber,
}) =>
  years.map((year) => {
    const start = parseInt(year);
    const end = start + duration;
    const useScenario = year < 2010 ? "livneh" : `${modelId}_${scenarioId}`;
    return {
      id: start,
      text: `${start}-${end}`,
      src: `${apiEndpoint}/series/${climvarId}_month_${useScenario}/${start}-${end}/${monthNumber}.png?style=swe&scale=10`,
    };
  });
