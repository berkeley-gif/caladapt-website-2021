import { getMapOverlayImgURL } from "./_getOverlayUrl";

export { getMapOverlayImgURL };

export const getMapImages = ({
  climvarId,
  modelId,
  years,
  period,
  scenarioId,
  monthNumber,
}) =>
  years.map((year) =>
    getMapOverlayImgURL({
      year,
      climvar: climvarId,
      model: modelId,
      scenario: scenarioId,
      period,
      month: monthNumber,
    })
  );
