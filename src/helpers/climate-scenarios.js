const scenarios = [
  {
    id: "rcp45",
    label: "Medium (RCP 4.5)",
    labelLong: "Medium Emissions (RCP 4.5) Scenario",
    desc: `In the Medium Emissions scenario (RCP 4.5), emissions peak around 2040, then decline.`,
  },
  {
    id: "rcp85",
    label: "High (RCP 8.5)",
    labelLong: "High Emissions (RCP 8.5) Scenario",
    desc: `In the High Emissions scenario, emissions continue to rise strongly 
    through 2050 and plateau around 2100.`,
  },
  {
    id: "historical",
    label: "Historical",
    labelLong: "Historical Scenario",
    desc: "The historical scenario represents a period from 1950–2006.",
  },
  {
    id: "late_century",
    label: "Late 21st Century",
    labelLong: "Late 21st Century Drought (2051–2070)",
    desc: `Scenario represents a late century dry spell from 2051–2070 identified from 
    the HadGEM2-ES RCP 8.5 simulation. The extended drought scenario is based on the average 
    annual precipitation over 20 years. This average value equates to 78% of historical median 
    annual precipitation averaged over the North Coast and Sierra California Climate Tracker regions.`,
  },
  {
    id: "early_century",
    label: "Early 21st Century",
    labelLong: "Early 21st Century Drought (2023–2042)",
    desc: `Scenario represents an early century dry spell from 2023–2042 derived from the 
    late century drought scenario. The precipitation during this scenario is the same as 
    in the late century scenario, however the temperature has been adjusted to take into 
    account climate warming over the century.`,
  },
];

export default scenarios;
