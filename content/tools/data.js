
const categories = ['All', 'Temperature', 'Precipitation', 'Snowpack', 'Sea Level Rise', 'Wildfire'];

const tools = [
  {
    title: 'Local Climate Change Snapshot',
    desc: `A starting ppoint for users to get a quick sense of climate impacts for your location.`,
    categories: ['Temperature', 'Precipitation'],
    slug: 'local-climate-change-snapshot',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
      'img/icons/wildfire.svg',
    ],
  },
  {
    title: 'Annual Averages',
    desc: `Explore projected annual averages of maximum temperature, minimum temperature and 
    precipitation for your location.`,
    categories: ['Temperature', 'Precipitation'],
    slug: 'annual-averages',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
    ],
  },
  {
    title: 'Annual Averages 2',
    desc: `Explore projected annual averages of maximum temperature, minimum temperature and 
    precipitation for your location.`,
    categories: ['Temperature', 'Precipitation'],
    slug: 'annual-averages-2',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
    ],
  },
  {
    title: 'Maps of Projected Change',
    desc: `Explore maps of projected long-term (30 years) changes in annual average 
    temperature and precipitation.`,
    categories: ['Temperature', 'Precipitation'],
    slug: 'maps-of-projected-change',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
    ],
  },
  {
    title: 'Extreme Precipitation Events',
    desc: `Explore changes in intesity and frequency of extreme precipitation events.`,
    categories: ['Precipitation'],
    slug: 'extreme-precipitation',
    icons: [
      'img/icons/rainfall.svg',
    ],
  },
  {
    title: 'Extreme Heat',
    desc: `Explore projected frequency and duration of extreme heat days and warm nights.`,
    categories: ['Precipitation'],
    slug: 'extreme-heat',
    icons: [
      'img/icons/sun.svg',
    ],
  },
  {
    title: 'Sea Level Rise - CalFloD-3D',
    desc: `Explore maps of inundation location and depths for San Francisco Bay Area, 
    Sacramento - San Joaquin Delta and the California coast during near 100 year storm 
    events coupled with projected Sea Level Rise scenarios.`,
    categories: ['Sea Level Rise', 'Flooding'],
    slug: 'slr-calflod-3d',
    icons: [
      'img/icons/sea.svg',
    ],
  },
  {
    title: 'Snowpack',
    desc: `View timelapse animation and monthly averages of projected Snow Water Equivalent, 
    a common measurement for snowpack.`,
    categories: ['Snowpack'],
    slug: 'snowpack',
    icons: [
      'img/icons/snowflake.svg',
    ],
  },
  {
    title: 'Wildfire',
    desc: `Annual averages of area burned for combination of 4 GCMs, 2 RCPs and 3 population growth scenarios.`,
    categories: ['Wildfire'],
    slug: 'wildfire',
    icons: [
      'img/icons/wildfire.svg',
    ],
  },
  {
    title: 'Cooling Degree Days and Heating Degree Days',
    desc: `Explore projected changes in Heating Degree Days and Cooling Degree Days, which are a common proxy 
    for energy needed to heat and cool buildings.`,
    categories: ['Temperature'],
    slug: 'degree-days',
    icons: [
      'img/icons/sun.svg',
    ],
  },
  {
    title: 'Stream Flow',
    desc: `Charts of VIC routed and bias corrected streamflows driven by LOCA downscaled temperature 
    and precipitation.`,
    categories: ['Precipitation'],
    slug: 'streamflow',
    icons: [
      'img/icons/rainfall.svg',
    ],
  },
  {
    title: 'Extended Drought',
    desc: `Explore projections of temperature, precipitation and a set of VIC variables from two 30 year 
    drought periods.`,
    categories: ['Temperature', 'Precipitation'],
    slug: 'extended-drought',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
    ],
  },
  {
    title: 'Hourly Projections of Sea Level',
    desc: `Explore hourly sea level projections at selected Tide Gauge Locations along the California coast.`,
    categories: ['Sea Level Rise'],
    slug: 'slr-hourly-projections',
    icons: [
      'img/icons/sea.svg',
    ],
  },
];

export { categories, tools };