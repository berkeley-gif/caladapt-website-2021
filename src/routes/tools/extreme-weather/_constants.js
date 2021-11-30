import layers from "~/helpers/mapbox-layers";

export const TOOL_SLUG = "extreme-weather";

export const DEFAULT_STATION_LAYER = layers.find(
  (d) => d.id === "hadisdstations"
);
export const DEFAULT_STATION_ID = 11;

export const CLIMATE_VARIABLES = ["tasmax", "tasmin", "wspeed"];
export const DEFAULT_CLIMATE_VARIABLE = "tasmax";
export const DEFAULT_SELECTED_EXTREME = "high";
export const DEFAULT_SELECTED_DAY = new Date();
export const DEFAULT_STATION = {
  title: "Weather Station at Fresno Yosemite International Airport, Fresno, CA",
  geometry: {
    type: "Point",
    coordinates: [-119.719, 36.78],
  },
  id: 11,
  properties: {
    name: "Fresno Yosemite International Airport",
    usaf: 723890,
    wban: 93193,
    elevation_m: 101.5,
    icao: "KFAT",
    city: "Fresno",
    climdiv: 5,
  },
  bbox: [-119.719, 36.78, -119.719, 36.78],
};

export const DEFAULT_PERCENTILES = [1, 10, 90, 99];
export const DEFAULT_THRESHOLD = 100;

export const EXTREMES = [
  { id: "high", label: "High Extremes" },
  { id: "low", label: "Low Extremes" },
];
export const DEFAULT_CLIMVAR_EXTREMES = [
  { climvar: "tasmax", defaultValue: "high", extremes: ["high", "low"] },
  { climvar: "tasmin", defaultValue: "low", extremes: ["high", "low"] },
  { climvar: "wspeed", defaultValue: "high", extremes: ["high"] },
];

export const CHART_DESCRIPTION = `<p><strong>Histogram</strong></p>
	<p>The histogram shows the distribution 
	of selected climate variable around a 21 day window for the Baseline Period (1991-2020). 
	The data values for a climate variable are grouped into buckets and represented 
	by columns along the X axis. The Y axis represents the percentage of occurences 
	in the data for each column.</p>
  <p><strong>Forecast</strong></p>
  <p>This section of the chart can be displayed or hidden by using the checkbox 
  at top of the chart. It shows the Near-Term forecast from the National 
  Weather Service (NWS) for selected climate variable and location 
  (latitide, longitude).</p>
  <p><strong>Recent Observations</strong></p>
  <p>This section of the chart can be displayed or hidden by using the checkbox 
  at top of the chart. It shows archived daily observations from the National 
  Centers for Environmental Information (NCEI) for the selected station. Following 
  data types are used for the corresponding climate variables:</p>
  <ul>
    <li>TMAX: Maximum temperature</li>
    <li>TMIN<: Minimum temperature</li>
    <li>WSF2, WDF2: Fastest 2-minute wind speed, Direction of fastest 2-minute wind</li>
  </ul>
  <p>There is usually a time lag of 2-3 days in the data provided by 
  NCEI, so you may not see data for the last 2-3 days.</p>
  <p>Both the NWS Forecast and Recent Observations are presented with respect 
  to <strong>today's date</strong> and <strong>do not change</strong> if you 
  select another Day of Year value.
`;

export const SELECT_STATION_DESCRIPTION = `<p>You can select another weather station on 
the map or search for the nearest station to your area of interest.</p>`;

export const THRESHOLD_DESCRIPTION = `<p>The threshold sets the conditions for which a 
	weather event is considered “extreme“.</p>
  <p>Due to the nature of the extreme value statistics, only threshold values at 
  or above the 90th percentile for Maximum Temperature & Maximum Wind Speed, and at or below the 10th 
  percentile for Minimum Temperature, are allowed for this input.</p>`;

export const EXTREME_EVENT_DESCRIPTION = `<p>According to WMO 
 	(<a href="https://ane4bf-datap1.s3-eu-west-1.amazonaws.com/wmocms/s3fs-public/event/related_docs/DraftversionoftheGuidelinesontheDefinitionandMonitoringofExtremeWeatherandClimateEvents.pdf?h2Kr0f7dXp6CXZzoclQYveoEQ9FNoO5r" target="_blank">2016</a>), 
 	an extreme can be identified when a single climate variable exceeds its specific threshold, 
 	which can be varying percentile-based values, fixed absolute values and return period.</p>
	<p>This tool uses Extreme Value Theory 
	(<a href="https://link.springer.com/book/10.1007%2F978-1-4471-3675-0" target="_blank">Coles, 
	2001</a>) to evaluate the exceedance probability of rare events that lie far in the 
	tails (upper and lower ranges) of the probability distribution of a weather variable.</p>
	<p>The following descriptive terms are used for labeling extreme events:
	<ul style="padding-left:1.5rem;">
	<li><strong>Extreme</strong>: Exceedance Probability <= 1%</li>
	<li><strong>Rare</strong>: Exceedance Probability > 1% and < 25%</li>
	<li><strong>Common</strong>: Exceedance Probability <= 25%</li>
	</ul>`;

export const PROPBABILITY_DESCRIPTION = `<p>The Exceedance Probability describes the 
 	likelihood of a specific threshold temperature being exceeded in any given year. 
 	Annual maxima from 30 years of observed data for the Baseline Period are used to 
 	calculate the estimated exceedance probability.</p>`;

export const DOY_DESCRIPTION = `<p>This can be any day of the year you wish to see data 
	for. Selecting a different year has no effect. Please note that the Near-Term forecast & 
	Recent Observations are for today's date only and do not change if you select a 
	different day of year.</p>`;

export const EXTREMES_DESCRIPTION = `<p><strong>High Extremes</strong></p>
	<p>For Maximum Temperature, selecting High Extremes (the default) focuses on days with 
	the highest values (right tail) of maximum daily temperature.</p>
  <p>For Minimum Temperature, selecting High Extremes focuses on days with the warmest 
  minimum daily temperatures.</p>
  <p>For Maximum Wind Speed, selecting High Extremes focuses on days with 
  the highest values of maximum daily wind speed.</p>
  <p><strong>Low Extremes</strong></p>
  <p>For Maximum Temperature, selecting Low Extremes focuses on days with 
  the lowest values (left tail) of maximum daily temperature.</p>
  <p>For Minimum Temperature, selecting Low Extremes (the default) focuses on 
  days with the coolest minimum daily temperatures.</p>`;
