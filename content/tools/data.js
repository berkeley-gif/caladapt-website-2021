const categories = ['All', 'Temperature', 'Precipitation', 'Snowpack', 'Sea Level Rise', 'Wildfire'];

const tools = [
  {
    title: 'Local Climate Change Snapshot',
    desc: `A starting point to get climate impacts for your location.`,
    categories: ['Temperature', 'Precipitation', 'Wildfire'],
    slug: 'local-climate-change-snapshot',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
      'img/icons/wildfire.svg',
    ],
  },
  {
    title: 'Annual Averages',
    desc: `Projected annual averages of maximum & minimum temperatures and precipitation.`,
    categories: ['Temperature', 'Precipitation'],
    slug: 'annual-averages',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
    ],
    datasets: [
      {
        slug: 'cb0c5f49-59d2-4f8e-8d9c-a047833f6081',
        logo: 'scripps_100x100.png',
      },
      {
        slug: '0887cba6-695c-403a-a757-674075799ea5',
        logo: 'u_colorado.png',
      },
      {
        slug: 'b8bee9f9-31c1-40d9-89a3-2dad814ba7da',
        logo: 'gif_80x80.png'
      }
    ],
    related: [
      'maps-of-projected-change',
    ],
    resources: [
      'California Adaptation Clearinghouse', 
      "California's 4th Climate Change Assessment",
    ],
  },
  {
    title: 'Extreme Weather',
    desc: `Extreme weather events for baseline and future climates.`,
    categories: ['Temperature'],
    slug: 'extreme-weather',
    icons: [
      'img/icons/sun.svg',
    ],
    datasets: [
      {
        slug: '5e555315-da6a-4a49-a2a2-53408720ce08',
        logo: 'scripps_100x100.png',
      },
    ],
    related: [
      'extreme-heat',
    ],
    resources: [
      'California Adaptation Clearinghouse', 
      "California's 4th Climate Change Assessment",
    ],
  },
  {
    title: 'Maps of Projected Change',
    desc: `Maps depicting long-term (30 years) changes in annual average temperature and precipitation.`,
    categories: ['Temperature', 'Precipitation'],
    slug: 'maps-of-projected-change',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
    ],
  },
  {
    title: 'Extreme Precipitation Events',
    desc: `Changes in intesity and frequency of extreme precipitation events.`,
    categories: ['Precipitation'],
    slug: 'extreme-precipitation',
    icons: [
      'img/icons/rainfall.svg',
    ],
  },
  {
    title: 'Extreme Heat Days & Warm Nights',
    desc: `Projected frequency and duration of extreme heat days and warm nights.`,
    categories: ['Temperature'],
    slug: 'extreme-heat',
    icons: [
      'img/icons/sun.svg',
    ],
    datasets: [
      {
        slug: 'cb0c5f49-59d2-4f8e-8d9c-a047833f6081',
        logo: 'scripps_100x100.png',
      },
      {
        slug: '0887cba6-695c-403a-a757-674075799ea5',
        logo: 'u_colorado.png',
      },
      {
        slug: 'b8bee9f9-31c1-40d9-89a3-2dad814ba7da',
        logo: 'gif_80x80.png'
      }
    ],
    related: [
      'extreme-weather','extreme-precipitation',
    ],
    resources: [
      'California Adaptation Clearinghouse', 
      "California's 4th Climate Change Assessment",
    ],
  },
  {
    title: 'Sea Level Rise - CalFloD-3D',
    desc: `Maps of inundation during 100 year storm events with projected 
    Sea Level Rise scenarios.`,
    categories: ['Sea Level Rise', 'Flooding'],
    slug: 'slr-calflod-3d',
    icons: [
      'img/icons/sea.svg',
    ],
  },
  {
    title: 'Snowpack',
    desc: `Timelapse animation and monthly averages of projected Snow Water Equivalent.`,
    categories: ['Snowpack'],
    slug: 'snowpack',
    icons: [
      'img/icons/snowflake.svg',
    ],
    datasets: [
      {
        slug: "e3463df5-5ecc-42fb-a947-07868a8eee8c",
        logo: "gif_80x80.png"
      },
      {
        slug: "bac951c9-a781-40e1-b65d-5a14578157e9",
        logo: "gif_80x80.png"
      }
    ],
    related: [
      'maps-of-projected-change'
    ],
    resources: [
      "California's Adaptation Clearinghouse",
      "Regional Reports: California's 4th Climate Change Assessment"
    ]
  },
  {
    title: 'Wildfire',
    desc: `Annual and monthly averages of area burned and decadal fire probability for 4 GCMs, and 2 RCPs.`,
    categories: ['Wildfire'],
    slug: 'wildfire',
    icons: [
      'img/icons/wildfire.svg',
    ],
    datasets: [
      {
        slug: 'bfa874e7-90b4-4948-a3ba-b5611e63cf2a',
        logo: 'uc-merced-snri.png'
      },
      {
        slug: 'e852c07a-9241-4123-98f9-8ed553ed1781',
        logo: 'gif_80x80.png'
      }
    ],
    related: [
      'extreme-heat',
      'maps-of-projected-change',
    ],
    resources: [
      'California Adaptation Clearinghouse', 
      "California's 4th Climate Change Assessment",
    ]
  },
  {
    title: 'Cooling Degree Days and Heating Degree Days',
    desc: `A common proxy for energy needed to heat and cool buildings.`,
    categories: ['Temperature'],
    slug: 'degree-days',
    icons: [
      'img/icons/sun.svg',
    ],
    datasets: [
      {
        slug: 'cb0c5f49-59d2-4f8e-8d9c-a047833f6081',
        logo: 'scripps_100x100.png',
      },
      {
        slug: '0887cba6-695c-403a-a757-674075799ea5',
        logo: 'u_colorado.png',
      },
    ],
    related: [
      'extreme-heat',
      'maps-of-projected-change',
    ],
    resources: [
      'California Adaptation Clearinghouse', 
      "California's 4th Climate Change Assessment",
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
    desc: `Explore projections of temperature, precipitation and a set of hydrological variables 
      from two 20 year drought periods.`,
    categories: ['Temperature', 'Precipitation'],
    slug: 'extended-drought',
    icons: [
      'img/icons/sun.svg',
      'img/icons/rainfall.svg',
      'img/icons/snowflake.svg',
    ],
    datasets: [
      {
        slug: '932188b3-2e32-4eb1-882d-c00e79197192',
        logo: 'scripps_100x100.png',
      },
      {
        slug: '0887cba6-695c-403a-a757-674075799ea5',
        logo: 'u_colorado.png',
      },
      {
        slug: 'b8bee9f9-31c1-40d9-89a3-2dad814ba7da',
        logo: 'gif_80x80.png'
      },
      {
        slug: 'e3463df5-5ecc-42fb-a947-07868a8eee8c',
        logo: 'gif_80x80.png'
      }
    ],
    related: [
      'extreme-heat','extreme-precipitation',
    ],
    resources: [
      'California Adaptation Clearinghouse', 
      "California's 4th Climate Change Assessment",
    ],
  },
  {
    title: 'Hourly Projections of Sea Level',
    desc: `Hourly sea level projections at selected Tide Gauge Locations along the California coast.`,
    categories: ['Sea Level Rise'],
    slug: 'slr-hourly-projections',
    icons: [
      'img/icons/sea.svg',
    ],
  },
];

export { categories, tools };