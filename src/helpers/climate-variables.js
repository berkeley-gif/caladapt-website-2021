/**
 * Climate Variables module.
 * @module climate-variables
 */

//import Sun from '../../static/img/icons/sun.svg';
// import Rainfall from '../../static/img/icons/rainfall.svg';
// import Wildfire from '../../static/img/icons/wildfire.svg';
// import Snowflake from '../../static/img/icons/snowflake.svg';
// import Sea from '../../static/img/icons/sea.svg';
import { Sun, Rainfall, Wildfire, Snowflake } from "../components/icons";

const variables = [
  {
    id: "tasmax",
    label: "Maximum Temperature",
    icon: Sun,
    text: "Maximum daily temperature which typically occurs in the early afternoon.",
    units: {
      imperial: "°F",
      metric: "°C",
    },
    decimals: 1,
  },
  {
    id: "tasmin",
    label: "Minimum Temperature",
    icon: Sun,
    text: "Minimum daily temperature which typically occurs in the early morning before sunrise.",
    units: {
      imperial: "°F",
      metric: "°C",
    },
    decimals: 1,
  },
  {
    id: "pr",
    label: "Precipitation",
    icon: Rainfall,
    text: "Accumulated rainfall and snowfall.",
    units: {
      imperial: "inches",
      metric: "mm",
    },
    decimals: 1,
  },
  {
    id: "cdd",
    label: "Cooling Degree Days",
    icon: "",
    text: "A Cooling Degree Day is defined as the number of degrees by which a daily average temperature exceeds a reference temperature.",
    units: {
      imperial: "days",
      metric: "days",
    },
    decimals: 0,
  },
  {
    id: "hdd",
    label: "Heating Degree Days",
    icon: "",
    text: "A Heating Degree Day is defined as the number of degrees by which a daily average temperature is below a reference temperature.",
    units: {
      imperial: "days",
      metric: "days",
    },
    decimals: 0,
  },
  {
    id: "tair",
    label: "Tair",
    icon: Sun,
    text: "Average Temperature",
    units: {
      imperial: "°F",
      metric: "°C",
    },
    decimals: 1,
  },
  {
    id: "et",
    label: "Evapotranspiration",
    text: "Water that is evaporated from the surfaces and transpired from plants.",
    icon: "",
    units: {
      imperial: "inch",
      metric: "mm",
    },
    decimals: 1,
  },
  {
    id: "swe",
    label: "Snow Water Equivalent",
    text: "The amount of water that is stored in the snowpack.",
    icon: Snowflake,
    units: {
      imperial: "inch",
      metric: "mm",
    },
    decimals: 1,
  },
  {
    id: "baseflow",
    label: "Baseflow",
    text: "Portion of the stream flow that is not from precipitation and results from seepage of water from the ground.",
    icon: "",
    units: {
      imperial: "inch",
      metric: "mm",
    },
    decimals: 1,
  },
  {
    id: "runoff",
    label: "Runoff",
    text: "Water that is discharged into the streams and largely results from precipitation and melting of snow.",
    icon: "",
    units: {
      imperial: "inch",
      metric: "mm",
    },
    decimals: 1,
  },
  {
    id: "soilmoist1",
    label: "Soil Moisture Layer 1",
    text: "Soil Moisture Layer 1",
    icon: "",
    units: {
      imperial: "",
      metric: "",
    },
    decimals: 1,
  },
  {
    id: "soilmoist2",
    label: "Soil Moisture Layer 2",
    text: "Soil Moisture Layer 2",
    icon: "",
    units: {
      imperial: "",
      metric: "",
    },
    decimals: 1,
  },
  {
    id: "soilmoist3",
    label: "Soil Moisture Layer 3",
    text: "Soil Moisture Layer 3",
    icon: "",
    units: {
      imperial: "",
      metric: "",
    },
    decimals: 1,
  },
  {
    id: "fire",
    label: "Wildfire",
    text: "Area Burned",
    icon: Wildfire,
    units: {
      imperial: "acres",
      metric: "hectares",
    },
    decimals: 1,
  },
  {
    id: "fireprob",
    label: "Wildfire Probability",
    text: "Decadal Fire Probability",
    icon: Wildfire,
    units: {
      imperial: "",
      metric: "",
    },
    decimals: 0,
  },
];
export default variables;
