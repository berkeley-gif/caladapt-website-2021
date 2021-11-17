import { sum, mean } from "d3-array";
import { getMapOverlayImgURL } from "./_getOverlayUrl";

export { getMapOverlayImgURL };

export const getMapImages = ({
  climvarId,
  modelId,
  years,
  simulation,
  scenarioId,
  monthNumber,
  palette,
}) =>
  years.map((year) =>
    getMapOverlayImgURL({
      year,
      climvar: climvarId,
      model: modelId,
      scenario: scenarioId,
      simulation,
      month: monthNumber,
      palette,
    })
  );

export const getAvgPctNoData = (dataStore) =>
  mean(dataStore.map((d) => mean(d.values, (v) => v.pctnd)));

export const isEmptyData = (dataStore) =>
  sum(dataStore.map((d) => d.values.length)) === 0;
