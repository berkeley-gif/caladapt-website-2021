import { leftPad } from "~/helpers/utilities";

export const getMapOverlayImgURL = ({
  year = 1960,
  duration = 10,
  climvar = "fire",
  model = "CanESM2",
  scenario = "rcp45",
  palette = "YlOrRd",
  period = "annual",
  month = 8,
}) =>
  `https://api.cal-adapt.org/api/series/${climvar}_${getIndicatorStr(
    climvar,
    period
  )}_${getModelScenarioStr(
    model,
    scenario,
    climvar,
    period,
    month
  )}/${year}-${getYearEndStr(year, duration)}/${getFileNameStr(
    climvar,
    period,
    month
  )}?scale=10&style=${palette}&limits=${getLimitsStr(climvar)}&srid=3857`;

const getModelScenarioStr = (model, scenario, climvar, period, month) =>
  `${model}_${scenario}_${climvar === "fire" ? "bau_mu" : "bau"}${
    climvar === "fireprob" ? getFireProbStr(period, month) : ""
  }`;

const getFireProbStr = (period, month) =>
  period === "month" ? `_${leftPad(month, 2, "0")}` : "";

const getIndicatorStr = (climvar, period) => {
  if (climvar === "fire") {
    return period;
  } else {
    return "10y";
  }
};

const getLimitsStr = (climvar) => {
  if (climvar === "fire") {
    return [1, 100].join(",");
  } else {
    return [0, 0.9].join(",");
  }
};

const getYearEndStr = (year, duration) => `${year + duration - 1}`;

const getFileNameStr = (climvar, period, month) => {
  if (climvar === "fire") {
    return `${period === "year" ? "image" : month}.png`;
  } else {
    return "image.png";
  }
};
