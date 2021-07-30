---
title: About climate projections and models
order: 4
---

Questions:

- What are climate projections?
- How are climate projections generated? What is a GCM?
  - Downscaling
  - Climate projections and GCMs on Cal-Adapt
- How are climate models validated?
- How are greenhouse gas emissions incorporated in climate models? What is an RCP?

## What are climate projections?

The data presented in Cal-Adapt tools are projections, or estimates, of future climate. They are not weather predictions and should not be treated as such. Weather is the behavior of the atmosphere over short periods, such as days and weeks. Conversely, climate is the long-term behavior of the atmosphere, and it is almost always expressed in averages – for example, average annual temperature, average monthly rainfall, or average water equivalent of mountain snowpack at a given time of year. In other words, climate is the statistics of weather.

Climate projections cannot tell us what will happen on a given date in the future. But they can tell us what to expect from our future climate in general: how much warmer the average July is likely to be, or how much less snow will accumulate in the mountains in the average winter. Climate projections can also tell us how much more often (or less often) extreme events such as heat waves and heavy rainfall are likely to occur in the future. However, they cannot predict when those events will actually occur.

## How are climate projections generated? What is a GCM?

Climate scientists create projections of future climate using powerful tools called global climate models (often referred to using the technical name “general circulation models,” or GCMs). Global climate models are complex pieces of computer software that crunch through thousands of mathematical equations representing the scientific theory of how the climate system works. They can be used to simulate climate over past periods or to run experiments in which scientists impose certain conditions on the model to see how the climate system responds. A future climate projection is the product of global climate model experiments in which scientists impose upon the model some scenario of the future atmospheric concentration of greenhouse gases.

When climate scientists run a climate model, they divide the area of study into a grid, and then the model performs calculations for each individual cell within the grid. The output from those calculations can then be visualized on a map, similar to the map-based visualizations in Cal-Adapt. In climate model projections, for any given snapshot in time, each grid cell is represented by a single value for temperature, precipitation, or other climate variable of interest.

### Downscaling

The grid cells in most GCMs are very large – often from 100 to 600 kilometers squared. This coarse resolution is fine when scientists are studying climate on the global scale, but it is not very useful when we are trying to understand climate change on smaller scales, particularly for adaptation planning. We know that present-day climate varies greatly from region to region in California, and so we expect future climate to vary accordingly. But that detail is lost in global climate model outputs in which all of California may be represented by just a few grid cells. To be able to plan for the future, we need to produce higher-resolution projections of future climate. Climate scientists do just that by using various statistical techniques to “downscale” global climate model outputs to finer spatial scales. The data in Cal-Adapt is taken from a selection of global climate models and downscaled to a grid cell size of about 6 km by 6 km. The climate data hosted on Cal-Adapt was downscaled using localized constructed analogs (LOCA), a statistical downscaling technique that uses past history to add improved fine-scale detail to global climate models.

![Image: Chart, surface chart](#)

[Figure: comparison of GCM output and LOCA downscaled output - Pierce et al. 2018](#)

### Climate projections and GCMs on Cal-Adapt

Cal-Adapt hosts climate projections from 32 general circulation models (GCMs). GCMs are usually named after the research center where they were generated and are maintained. For example, the GFDL-CM3 model is run primarily by the National Oceanic and Atmospheric Administration (NOAA) Geophysical Fluid Dynamics Laboratory (GFDL).

Each GCM has strengths and shortcomings in how it depicts conditions for a place or a specific aspect of climate. As a result, climate change analysis is usually best informed when you consider the average values across different models and the full range of individual model values to capture all probable conditions. If you have limited analytic capacity, California’s Fourth Climate Change Assessment has identified a set of 10 GCMs that collectively describe climate conditions in California particularly well and provide common climate scenarios for projecting future climate conditions. A smaller subset of 4 GCMs has been further selected and recommended for use as “priority” models. Cal-Adapt tools default to these 4 priority models, and you can use these smaller sets of 4 or 10 models if you need to.

![Image: model selection GUI]()

[Figure: List of priority GCMs on Cal-Adapt]

## How are climate models validated?

Climate models are typically validated by modeling historical climate and then comparing this modeled historical climate (called a hindcast) to observed historical climate. If observed historical climate and modeled historical climate compare favorably, the climate model is often considered valid.

Climate models can also be put through a series of standardized diagnostic tests to see how skillfully they perform compared to other validated models, especially in generating phenomena observed in paleoclimate records. This practice is referred to as model intercomparison. A common intercomparison test is inputting an instantaneous increase in carbon dioxide to four times pre-industrial levels. Another common test is a gradual, steady increase in carbon dioxide concentrations until reaching four times pre-industrial levels.

## How are greenhouse gas emissions incorporated in climate models? What is an RCP?

The main driver of human-caused climate change is our emission of carbon dioxide and other greenhouse gases into the atmosphere. Greenhouse gases are so called because they trap heat in the atmosphere, causing it to warm over time. Atmospheric warming in turn leads to other changes throughout the earth system. How much the climate changes in the future depends in large part on the amount of greenhouse gases we emit now and going forward. However, since our emissions of greenhouse gases depend on a variety of different social, political, and economic factors, we cannot be certain how they will change. Nonetheless, we can formulate educated guesses about how greenhouse gas emissions might change and use those scenarios to create future climate projections.

Each tool in Cal-Adapt shows climate outcomes for two plausible greenhouse gas scenarios: a high-emissions trajectory in which greenhouse gas emissions continue to rise over the 21st century, and a lower-emissions trajectory in which greenhouse gas emissions level off around the middle of the 21st century and by the end of the century are lower than 1990 levels. These emissions trajectories are referred to as representative concentration pathways (RCPs), as described in the table below.

| Emissions trajectory | Definition                                                        | Description                                                  | Outcome        |
| -------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | -------------- |
| RCP 4.5              | 4.5 watts per meter squared of radiative forcing in the year 2100 | Emissions peak around 2040 and then decline                  | Medium warming |
| RCP 8.5              | 8.5 watts per meter squared of radiative forcing by the year 2100 | Emissions rise strongly through 2050 and plateau around 2100 | High warming   |

_Table: greenhouse gas trajectory scenarios hosted on Cal-Adapt_

![Image: Chart, line chart, RCP 4.5](#)

![Image: Chart, line chart, RCP 8.5](#)

_Figure: comparison of RCP 4.5 and RCP 8.5 temperature trajectories on Cal-Adapt_
