/** The taglines used in this list are now part of Glossary except maybe kbdigt600
 * TODO: Figure out how to use glossary entries and remove tagline property
 **/
export const indicatorList = [
  {
    id: 'tasmax',
    categoryId: 'temperature',
    name: 'Annual Average Maximum Temperature',
    units: '°F',
    decimals: 1,
    yScaleBaseValue: null,
    tagline: 'Average of all the hottest daily temperatures in a year.',
  },
  {
    id: 'exheat',
    categoryId: 'temperature',
    name: 'Extreme Heat Days',
    units: 'days',
    decimals: 0,
    yScaleBaseValue: 0,
    tagline: 'Number of days in a year when daily maximum temperature is above a threshold temperature',
  },
  {
    id: 'tasmin',
    categoryId: 'temperature',
    name: 'Annual Average Minimum Temperature',
    units: '°F',
    decimals: 1,
    yScaleBaseValue: null,
    tagline: 'Average of all coldest daily temperatures in a year.',
  },
  {
    id: 'exheatn',
    categoryId: 'temperature',
    name: 'Warm Nights',
    units: 'nights',
    decimals: 0,
    yScaleBaseValue: 0,
    tagline: 'Number of days in a year when daily minimum temperature is above a threshold temperature',
  },
  {
    id: 'rx1day',
    categoryId: 'precipitation',
    name: 'Maximum 1-day Precipitation',
    units: 'inches',
    decimals: 3,
    yScaleBaseValue: null,
    tagline: `The maximum daily precipitation amount for each year. In other words, the greatest 
    amount of daily rain or snow (over a 24 hour period) for each year.`,
  },
  {
    id: 'cddm',
    categoryId: 'precipitation',
    name: 'Maximum Length of Dry Spell',
    units: 'days',
    decimals: 0,
    yScaleBaseValue: 0,
    tagline: `The maximum length of dry spell for each year. In other words, 
    the maximum number of consecutive days with precipitation < 1mm for each year.`,
  },
  {
    id: 'speiltm1',
    categoryId: 'precipitation',
    name: 'SPEI 1-month',
    units: 'months',
    decimals: 1,
    yScaleBaseValue: 0,
    tagline: `Number of months in a year with a Standardised Precipitation-Evapotranspiration 
    Index (SPEI) <= -1. SPEI is a multi-scalar drought index and can be used to detect, monitor 
    and analyze droughts.`,
    note: `The standardized precipitation-evaporation index (SPEI) depicts the combined 
    impacts of precipitation deficits and potential evapotranspiration on soil moisture. 
    SPEI does not include impacts from effects like wind speed, relative humidity or solar 
    radiation impacts (typically short-term forcing) – making it more reflective of 
    long-term hydrological and ecological drought conditions. Here we present SPEI 
    calculated for a 9-month period, attempting to reflect a length slightly longer than 
    California’s typical wet period.  A value less than -1 implies the drought is at 
    least moderate in intensity, with more negative values representing more severe droughts.`,
  },
  {
    id: 'swe',
    categoryId: 'precipitation',
    name: 'April SWE',
    units: 'inches',
    decimals: 1,
    yScaleBaseValue: null,
    tagline: `Snow Water Equivalent (SWE), is a commonly used measurement used by 
    hydrologists and water managers to gage the amount of liquid water contained within 
    the snowpack.`,
  },
  {
    id: 'pr',
    categoryId: 'precipitation',
    name: 'Annual Precipitation',
    units: 'inches',
    decimals: 1,
    yScaleBaseValue: null,
    tagline: 'Total precipitation projected for a year',
  },
  {
    id: 'fire',
    categoryId: 'wildfire',
    name: 'Annual Average Area Burned',
    units: 'acres',
    decimals: 1,
    yScaleBaseValue: null,
    tagline: 'Average of the area projected to be at risk to burning in a year.',
  },
  {
    id: 'kbdigt600',
    categoryId: 'wildfire',
    name: 'KBDI > 600',
    units: 'days',
    decimals: 0,
    yScaleBaseValue: null,
    tagline: `Number of days in a year where Keetch-Byram Drought Index (KBDI) > 600.
    KBDI provides an estimate for how dry the soil and vegetative detritus is.`,
    note: `KBDI is cumulative. The KBDI values increase on dry and warm days and decrease 
    during rainy periods. In California we would expect KBDI to increase from the 
    end of the wet season (spring) into the dry season (summer & fall). The list 
    below explains what values of KBDI represent:
    <table class="table table-bordered table-sm mt-2" style="font-size:90%;width:auto;color:#616161;">
    <tbody>
    <tr>
      <th scope="row">0–200</th>
      <td>Soil moisture and fuel moistures are high, low wildfire risk.</td>
    </tr>
    <tr>
      <th scope="row">200–400</th>
      <td>Soil and fuels start to dry, average wildfire risk.</td>
    </tr>
    <tr>
      <th scope="row">400–600</th>
      <td>Onset of drought with moderate to serious wildfire risk.</td>
    </tr>
    <tr>
      <th scope="row">600–800</th>
      <td>Severe drought, extreme wildfire risk and increased wildfire occurrence.</td>
    </tr>
    </tbody>
    </table>`,
  },
];