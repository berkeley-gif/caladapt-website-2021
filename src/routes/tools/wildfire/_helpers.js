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
