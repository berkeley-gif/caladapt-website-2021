---
title: Access to next generation climate data
author: Cal-Adapt
image: data.jpg
tags: data, Fifth Assessment
snippet: Access downscaled future climate projections and historical climate for models & scenarios at three spatial domains.
---

Preliminary climate data to be considered for <a href="https://opr.ca.gov/climate/icarp/climate-assessment/" target="_blank">California’s Fifth Climate Change Assessment</a> (Fifth Assessment) are available. This data is aligned with the latest generation of climate models from <a href="https://www.wcrp-climate.org/wgcm-cmip/wgcm-cmip6" target="_blank">Coupled Model Intercomparison Project Phase 6</a> (CMIP6) used by the <a href="https://www.ipcc.ch/assessment-report/ar6/" target="_blank">Intergovernmental Panel on Climate Change</a> (IPCC) global sixth assessment report.

## Models and scenarios

Several Global Climate Models (GCMs) from the CMIP6 archive have been selected for their ability to capture the relevant characteristics of California’s climate. The selection process is based on a rigorous GCM skill evaluation process (for more details on this process see <a href="https://www.energy.ca.gov/sites/default/files/2022-09/20220907_CDAWG_MemoEvaluating_GCMs_EPC-20-006_Nov2021-ADA.pdf" target="_blank">Krantz et al. 2021</a>). Future climate projections and historical climate from these GCMs are available for three spatial domains:
- 45 km x 45 km - Western North America
- 9 km x 9 km - Western Electricity Coordinating Council (WECC) region
- 3 km x 3 km - California

Scenarios in CMIP6 are called <a href="https://www.carbonbrief.org/explainer-how-shared-socioeconomic-pathways-explore-future-climate-change/" target="_blank">Shared Scenario Pathways</a> (SSPs). These replace the previous Representative Concentration Pathways (RCPs) used in CMIP5 which were focused specifically on greenhouse gas concentrations. The SSPs incorporate socioeconomic factors impacting potential greenhouse gas reduction scenarios. To explore a range of scenarios and models, data are available for three SSPs:
- SSP2-4.5: a middle of the road global emissions scenario
- SSP3-7.0: high global emissions scenario
- SSP5-8.5: very high global emissions scenario

## Data availability and use

Two different downscaling approaches have been used to generate the high spatial resolution output from the GCMs:
- Dynamical downscaling using the <a href="https://www.energy.ca.gov/sites/default/files/2022-09/20220907_CDAWG_MemoDynamicalDownscaling_EPC-20-006_May2022-ADA.pdf" target="_blank">Weather Research and Forecasting model</a> (WRF) by UCLA in support of EPC-20-006. This data is not bias corrected as of time of writing. Hourly, daily and monthly timeseries are available for all three spatial domains.
- Statistically downscaled using a statistical downscaling method known as <a href="https://loca.ucsd.edu/what-is-loca/" target="_blank">Localized Construction Analogs</a> (LOCA2) by Scripps Institute of Oceanography. LOCA2 datasets are bias-corrected (GCM output is adjusted to be consistent with empirical observations) using monthly mean conditions. Daily and monthly timeseries are available for the 3-km spatial domain.

Non-bias corrected data is best used to calculate change or trend signals (e.g. the trend in average temperature), while bias corrected data is appropriate for applications that require absolute numbers (e.g. temperature values at 2050) or changes in the extremes. For example, if you were concerned about a piece of equipment that fails when nightime temperatures do not drop below 80 F, or if you need to calculate the number of hours above a given temperature of concern, you would want to use bias-corrected data. Bias corrected data is particularly valuable when using models (i.e. demand forecasts for energy, or energy supply models) that have been calibrated using historical observations at a given location (i.e. an airport).  We anticipate that most Cal-Adapt enterprise users will be concerned with human or built environment impacts from climate change, and as such the majority of data in the data catalog is bias corrected.

Dynamically downscaled, hourly data is best suited for applications requiring data at fine temporal resolution and characterizing extreme conditions, while statistically downscaled data is available only at daily time scales but available for a greater number of GCMs, so can characterize a larger spread of possible future conditions.

The availability of GCMs, temporal resolutions and climate variables depends on the downscaling approach used. For the most up to date information on what’s available please refer to <a href="https://github.com/cal-adapt/climakitae/blob/main/climakitae/data/variable_descriptions.csv" target="_blank">this table</a>.  At the time of writing the following variables are available for both downscaling approaches:
- Air temperature at two meters
- Precipitation
- Specific humidity

## Data access

Energy sector users can access cloud computing resources and early versions of analytical tools to work with climate data through the <a href="https://analytics.cal-adapt.org/" target="_blank">Cal-Adapt Analytics Engine</a>. 

With support from the <a href="https://sustainability.aboutamazon.com/environment/the-cloud/amazon-sustainability-data-initiative" target="_blank">Amazon Sustainability Data Initiative</a>, users can also directly access Fifth Assessment data on a <a href="https://cadcat.s3.amazonaws.com/index.html" target="_blank">public S3 bucket</a> on Amazon Web Services (AWS). Learn how to access and download data from AWS using Python in this <a href="https://analytics.cal-adapt.org/faq/#how-can-i-download-the-climate-data-used-in-the-analytics-engine" target="_blank">detailed walkthrough</a>.

## New Cal-Adapt data download tool

The Cal-Adapt team is developing a new interactive web tool for downloading Fifth Assessment data and is looking for users to beta test it. If you are interested in helping to shape its development, please get in touch with the Cal-Adapt support team at support@cal-adapt.org.