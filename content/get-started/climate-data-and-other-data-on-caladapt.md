---
title: Climate data and other data on Cal-Adapt
order: 2
---

**Topics covered in this article:**

- What climate data does Cal-Adapt provide?
- What other data does Cal-Adapt provide?
- Can I upload my own data?

## What climate data does Cal-Adapt provide?

Cal-Adapt hosts climate change projections and related data generated for California’s Fourth Climate Change Assessment. Most of the projections on Cal-Adapt were derived by statistically downscaling the outputs of general circulation models (GCMs). You can learn more about general circulation models and downscaling here [link – Carbon Brief?](#).

The main datasets hosted on Cal-Adapt are listed in the table below. For more information on how to access these datasets, go to that section of the help documentation [link to help].

<div class="table-wrapper">

| Dataset                                           | Description                                                                                                                                                                                                                 | Reference                                                                                                             | Variables                                                                                                                                                                                                                                                                                                                                       | Scenarios                                                                    | Time periods        |
|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|---------------------|
| Localized Climate Analogues (LOCA)                | Statistically downscaled climate projections from global models                                                                                                                                                             | [Pierce et al. 2018](https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf)     | Maximum temperature, Minimum temperature, Precipitation, Relative humidity                                                                                                                                                                                                                                                                       | Modeled historical RCP 4.5 RCP 8.5                                           | 1950-2005 2006-2100 |
| Historical gridded data                           | Observation-based meteorological data                                                                                                                                                                                       | [Livneh et al. 2015](https://www.nature.com/articles/sdata201542)                                                      | Maximum temperature, Minimum temperature, Precipitation                                                                                                                                                                                                                                                                                           | Observed historical                                                          | 1950-2013           |
| Variable Infiltration Capacity (VIC) derived data | Climate variables derived using Variable Infiltration Capacity land surface/hydrology model                                                                                                                                 | [Liang et al. 1994](https://agupubs.onlinelibrary.wiley.com/doi/abs/10.1029/94JD00483)                                 | Evapotranspiration, Runoff, Soil moisture, Snow water equivalent, Snowfall rate, Rainfall rate, Snowmelt rate, Dew rate, Sensible heat, Latent heat flux, Potential evapotranspiration from vegetation, Air temperature, Relative humidity, Specific humidity, Albedo, Shortwave down radiation, Shortwave net radiation, Longwave net radiation, Sublimation net | Observed historical RCP 4.5 RCP 8.5                                          | 1950-2013 2006-2100 |
| CalFlod-3D                                        | Inundation location and depth for the San Francisco Bay area, the Sacramento-San Joaquin River Delta, and the California coast during extreme storm events occurring in conjunction with different sea level rise scenarios | [Radke et al. 2016](https://cal-adapt.org/media/files/CEC-500-2017-008.pdf)                                            | Inundation depth                                                                                                                                                                                                                                                                                                                                | 0.5 meters rise 1.0 meters rise 1.41 meters rise                             | N/A                 |
| Wildfire simulations                              | Wildfire scenario projections using a statistical model based on historical data of climate, vegetation, population density, and fire history coupled with regionally downscaled LOCA climate projections                   | [Westerling et al. 2018](https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-014_ADA.pdf) | Area burned                                                                                                                                                                                                                                                                                                                                     | RCP 4.5 RCP 8.5 Low population Central population High population            | 1960-2099           |
| Extended drought scenarios                        | 20-year drought scenarios constructed using data described in [Pierce et al. 2018](https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf)                                             | [Pierce et al. 2018](https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf)     | Maximum temperature, Minimum temperature, Precipitation, Evapotranspiration, Baseflow, Runoff, Soil moisture                                                                                                                                                                                                                                          | Early 21st century drought (2023-2042) Late 21st century drought (2051-2070) | 2018-2046 2046-2074 |
| Unimpaired streamflow projections                 | Bias-corrected unimpaired streamflow projections at 11 Sacramento-San Joaquin Delta sites                                                                                                                                   | [Pierce et al. 2018](https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf)     | Rate of streamflow                                                                                                                                                                                                                                                                                                                              | Observed historical Modeled historical RCP 4.5 RCP 8.5                       | 1922-2015 1951-2100 |
</div>

## What other data does Cal-Adapt provide?

In addition to hosting climate data, Cal-Adapt also hosts vector datasets containing administrative boundaries, hydrologic boundaries, and the LOCA (downscaling) model grid.

- LOCA model grid (1/16° – approximately 6 km on each side)
- California counties
- Watersheds (HUC10)
- Census tracts with CalEnviroScreen 3.0 scores
- 114th congressional districts
- Incorporated and census designated places (2015)
- Integrated Regional Water Management (IRWM) regions
- SWITCH load zones
- Climate zones
- Investor- and public-owned electrical utilities
- California’s Fourth Climate Change Assessment regions
- State of California

These vector datasets can be used to select, view, aggregate, and summarize climate data for a geography of interest.

<style>
    img.gs2_lccs_county_boundary_lg {
        width: 100%;
    }
</style>

<img class="gs2_lccs_county_boundary_lg" alt="Example of county boundary vector dataset on Cal-Adapt" height="" src="img/get-started/gs2_lccs_county_boundary_lg.jpg" srcset="img/get-started/gs2_lccs_county_boundary_sm.jpg 375w, img/get-started/gs2_lccs_county_boundary_lg.jpg 768w" sizes="(max-width: 375px) 375px, 768px">

_An example of a county boundary vector dataset on Cal-Adapt_

## Can I upload my own data?

_TO DO..._
