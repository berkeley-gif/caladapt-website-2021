export const CLIMATE_CATEGORIES = [
  {
    id: "temperature",
    label: "Temperature",
    icon: "img/icons/sun.svg",
    related: [
      "annual-averages",
      "extreme-heat",
      "maps-of-projected-change",
    ],
    resources: [
      {
        title: "California Heat Assessment Tool",
        link: "https://www.cal-heat.org/",
        image: "logos/chat.jpg",
      },
      {
        title: 'California"s Adaptation Clearinghouse: Temperature Impacts',
        link: "https://resilientca.org/search/?impacts=9&impacts=11",
        image: "logos/EJ_JRC_ccc_simulation-7094.jpg",
      },
      {
        title: 'Regional Reports: California"s 4th Climate Change Assessment',
        link: "https://www.climateassessment.ca.gov/regions/",
        image: "logos/ccc4a.jpg",
      },
    ],
  },
  {
    id: "precipitation",
    label: "Precipitation",
    icon: "img/icons/rainfall.svg",
    related: [
      "annual-averages",
      "extreme-precipitation",
      "maps-of-projected-change",
    ],
    resources: [
      {
        title: "Climate Change in the Sierra Nevada - UCLA",
        link: "https://www.ioes.ucla.edu/project/climate-change-sierra-nevada/",
        image: "logos/Sierra_Nevada_aerial.jpg",
      },
      {
        title: 'California"s Adaptation Clearinghouse: Precipitation Impacts',
        link: "https://resilientca.org/search/?impacts=12&impacts=15&impacts=17",
        image: "logos/EJ_JRC_ccc_simulation-7094.jpg",
      },
      {
        title: 'Regional Reports: California"s 4th Climate Change Assessment',
        link: "https://www.climateassessment.ca.gov/regions/",
        image: "logos/ccc4a.jpg",
      },
    ],
  },
  {
    id: "wildfire",
    label: "Wildfire",
    icon: "img/icons/wildfire.svg",
    related: [
      "wildfire",
      "extended-drought",
      "maps-of-projected-change",
    ],
    resources: [
      {
        title: "Cal Fire Data Hub",
        link: "https://hub-calfire-forestry.hub.arcgis.com/",
        image: "logos/calfire.jpg",
      },
      {
        title: `California"s Adaptation Clearinghouse: Wildfire Impacts`,
        link: "https://resilientca.org/search/?impacts=16",
        image: "logos/EJ_JRC_ccc_simulation-7094.jpg",
      },
      {
        title: `Regional Reports: California"s 4th Climate Change Assessment`,
        link: "https://www.climateassessment.ca.gov/regions/",
        image: "logos/ccc4a.jpg",
      },
    ],
  },
];