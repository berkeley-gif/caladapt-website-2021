import { leftPad } from "~/helpers/utilities";
import config from "~/helpers/api-config";

const { apiEndpoint } = config.env.production;

export const getMapOverlayImgURL = ({
  year = 1960,
  duration = 10,
  climvar = "fire",
  model = "CanESM2",
  scenario = "rcp45",
  palette = "YlOrRd",
  simulation = "year",
  month = 8,
}) =>
  `${apiEndpoint}/series/${climvar}_${getIndicatorStr(
    climvar,
    simulation
  )}_${getModelScenarioStr(
    model,
    scenario,
    climvar,
    simulation,
    month
  )}/${year}-${getYearEndStr(year, duration)}/${getFileNameStr(
    climvar,
    simulation,
    month
  )}?scale=10&style=${palette}&limits=${getLimitsStr(climvar)}&srid=3857`;

const getModelScenarioStr = (model, scenario, climvar, simulation, month) =>
  `${model}_${scenario}_${climvar === "fire" ? "bau_mu" : "bau"}${
    climvar === "fireprob" ? getFireProbStr(simulation, month) : ""
  }`;

const getFireProbStr = (simulation, month) =>
  simulation === "month" ? `_${leftPad(`${month}`, 2, "0")}` : "";

const getIndicatorStr = (climvar, simulation) => {
  if (climvar === "fire") {
    return simulation;
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

const getFileNameStr = (climvar, simulation, month) => {
  if (climvar === "fire") {
    return `${simulation === "year" ? "image" : month}.png`;
  } else {
    return "image.png";
  }
};
