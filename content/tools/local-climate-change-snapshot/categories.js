/** This structure is similar to content/tools/data.js
 * TODO: move resource details into content/resources/data.js
 **/
export const CLIMATE_CATEGORIES = [
  {
    id: "temperature",
    label: "Temperature",
    icon: "img/icons/sun.svg",
    tagline: `<p>Overall temperatures are projected to rise in California during the 21st 
    century. While the entire state will experience temperature increases, 
    the local impacts will vary greatly with many communities and ecosystems already 
    experiencing the effects of rising temperatures.</p>`,
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
    tagline: `<p>California's climate varies between wet and dry years. Research suggests that 
    for much of the state, wet years will become wetter and the dry years will become drier. Dry 
      years are also likely to be followed by dry years, increasing the risk of drought.</p>
    <p>While California does not see the average annual precipitation changing 
    significantly in the next 50-75 years, precipitation will likely be delivered in more intense 
    storms and within a shorter wet season. We are already seeing some of the impacts from a shift 
    towards larger year to year fluctuations.</p>`,
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
    tagline: `<p>The frequency, severity and impacts of wildfire are sensitive to climate change as well 
    as many other factors, including development patterns, temperature increases, wind patterns, 
    precipitation change and pest infestations. Therefore, <em>it is more difficult to project exactly where 
    and how fires will burn. Instead, climate models estimate increased risk to wildfires</em>.</p>
    <p>The Annual Average Area Burned can help inform at a high level if wildfire activity 
    is likely to increase. However, this information is not complete - many regions across the state 
    have no projections (such as regions outside combined fire state and federal protection responsibility 
    areas), and more detailed analyses and projections are needed for local decision-making. These projections are most robust for the Sierra Nevada given model inputs. However, as we have 
    seen in recent years, much of California can expect an increased risk of wildfire, with a wildfire 
    season that starts earlier, runs longer, and features more extreme fire events.</p>
    <p>Fire danger is complex. It is impacted by human activity, vegetation, wind, temperature, relative humidity, 
    atmospheric stability, etc. The Keetch-Byram Drought Index (KBDI) represents a simplified proxy for 
    favorability of occurrence and spread of wildfire but is not itself a predictor of fire.</p>`,
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