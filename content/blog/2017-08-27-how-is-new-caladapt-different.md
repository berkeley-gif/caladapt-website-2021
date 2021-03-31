---
title: How is the new Cal-Adapt different from the original Cal-Adapt?
author: Cal-Adapt
image: caladapt_post.png
tags: other
snippet: Read about how new Cal-Adapt 2.0 dramatically expands the capacities of the initial version.
---

The new Cal-Adapt (Cal-Adapt 2.0) dramatically expands the capacities of the initial version of [Cal-Adapt](http://v1.cal-adapt.org/), which was released
in 2011, in the following ways:
* New climate projections
* More powerful visualizations
* Improved access to primary data and a new public API
* Connections with supporting resources

Each of these is briefly described below.

## New Climate Projections

Cal-Adapt 2.0 makes use of new, high-resolution climate projections developed by researchers at the Scripps Institution of Oceanography at the University of California, San Diego. The underlying technique, [LOCA](http://loca.ucsd.edu/what-is-loca/) (LOcalized Constructed Analogues), was developed to address prior methods’ limitations with regard to representing temperature extremes and spatial distribution of precipitation. These improvements are critical, because extreme events associated with temperature and precipitation drive many of the economic and health-related impacts of climate change.

The high-resolution projections presented on Cal-Adapt 2.0 align with the suite of global climate models (also known as general circulation models or GCMs) as well as the emissions scenarios that form the foundation of the United Nations’ Intergovernmental Panel on Climate Change (IPCC) latest assessment report, namely the Fifth Assessment Report (AR5). For more information regarding the particular models shown on Cal-Adapt read our post on [Underlying Data and Model Selection in Cal-Adapt 2.0](http://localhost:3000/blog/2017/underlying-data-and-model-selection-in-cal-adapt-2-0/).

The projected temperature and precipitation data portrayed on Cal-Adapt 2.0 were statistically downscaled using [LOCA](http://loca.ucsd.edu/what-is-loca/) (Localized Climate Analogues), a method developed at Scripps Institution of Oceanography that is part of the University of California at San Diego. LOCA results are highly-resolved in both space (1/16° grid, ca. 3.7 miles × 3.7 miles) and time (daily resolution).

Among LOCA’s strengths are its [ability to better capture extreme temperatures and spatial distribution of precipitation](https://scripps.ucsd.edu/news/new-high-resolution-climate-projections-aim-better-represent-extreme-events). This is very important, because temperature extremes and precipitation are responsible for many of California’s climate vulnerabilities.

## Enhanced Visualizations

The visualizations on Cal-Adapt 2.0 include enhancements that respond to user feedback requested by the Technical Advisory Committee as well as through general feedback to [support@cal-adapt.org](mailto:support@cal-adapt.org):

* **Boundary choices for aggregation and visualization of data**. In addition to the default 1/16° grid (approximately 6 km × 6 km) used by LOCA, Cal-Adapt enables users to view and aggregate data according to a number of different boundary options, including counties, census tracts, congressional districts, Incorporated and census-designated places, watersheds, and electric utility service territories. Most tools also enable users to aggregate and view data for integrated regional water management regions, climate zones, load zones associated with the SWITCH-WECC model, and the state of California as a whole.
* **Ability to investigate disadvantaged communities using CalEnviroScreen**. To facilitate investigation of climate risks in disadvantaged communities (DACs), Cal-Adapt’s census tract selection tool presents CalEnviroScreen 3.0 scores and color codes census tract by score.
* **Enable user to upload a their own boundary for aggregation and visualization of data**. The boundary can be used for aggregation and visualization of data, to facilitate direct investigation on Cal-Adapt of areas that are highly specific to a particular user. The boundary can be uploaded in a variety of different formats e.g., ESRI Shapefile, GeoJSON, KML, WKT. This feature is useful for users who want to work with sensitive or proprietary information.
* **Slider Widgets**. Cal-Adapt 2.0 provides slider widgets for visualizations of climate and hydrological projections as well as wildfire risk. These sliders enable the user to average the graphed value over a user-specified historical period as well as a user-specified projected period.
* **Improved descriptions**. Visualizations on Cal-Adapt include brief descriptions of the underlying emissions scenario and location depicted, as well the data depicted in the chart.
* **Representation of envelope associated with CMIP5 models**. Time series charts for climate and hydrological parameters include a grey <q>envelope</q> defined by the maximum and minimum values from the CMIP5 ensemble of climate models (n=32). This <q>envelope</q> generally contains historical observations, and may be loosely interpreted as a proxy for uncertainty in future projected climate, much of which is attributable to climate variability.
* **Visualization of historical observed data through 2005**. Time series charts for climate and hydrological parameters include observed historical data (temperature, precipitation) or data derived from historical observations of temperature and precipitation in the case of hydrological parameters (e.g., snowpack).
* **Ability to zoom in on a particular time interval**. For time series charts, Cal-Adapt enables the user to select a subset of the full time interval shown (1950-2100), enabling the user to zoom in on a period of interest.
* **Save chart**. Charts can be downloaded directly from Cal-Adapt as PNG files.


## Improved Access to Data

Cal-Adapt 2.0 enables access to data through a number of options:

* **CSV download of data depicted on charts**. Time series shown on Cal-Adapt 2.0 charts can be downloaded directly as a csv file for easy exploration with other software programs.
* **Primary NetCDF data**. Cal-Adapt 2.0 provides direct access to data for all 32 CMIP5 models for 2 RCP scenarios (RCP4.5, RCP8.5) plus the historical modeled period as well as historical observed gridded data. These data are available directly from a server maintained by the Geospatial Innovation Facility at UC Berkeley as well as through several resources for which links are provided on Cal-Adapt 2.0.
* **GeoTIFF**. Users can download data for a user-specified geographic extent and for selected variables, scenario, period (daily vs. annual averages), and GCM in GeoTIFF format from the [Data](http://cal-adapt.org/data/) page.
* **Cal-Adapt API**. An Applications Programming Interface (API) provides programmatic access to climate data hosted on Cal-Adapt. The [Cal-Adapt API](http://api.cal-adapt.org/api/) is built using Django, Django REST framework, and Django-Spillway, an open source library developed at the GIF. The API follows an architectural style called REST (REpresentational State Transfer) which uses uses HTTP as the transport protocol for the message requests and responses. The API returns data in different formats, e.g. JSON, GeoTIFF and CSV.

## Cal-Adapt (API)

Because Cal-Adapt developers cannot anticipate (nor have the resources to fulfill) the full suite of tools, a Cal-Adapt API was designed to empower third party users to develop custom tools that are tailored to their specific applications. For more details on the Cal-Adapt API visit the [API docmentation](https://berkeley-gif.github.io/caladapt-docs/index.html).

