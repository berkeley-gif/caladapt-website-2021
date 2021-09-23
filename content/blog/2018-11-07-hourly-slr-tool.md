---
title: Hourly Sea Level Projections
author: Cal-Adapt
image: sf_king_tide.png
image_attrib: From Chris Martin on Flickr. San Francisco King Tide, 2016.
tags: tools
snippet: This new tool explores hourly sea level projections at selected Tide gauge locations along the California coast.
---

Researchers for <a href="http://www.climateassessment.ca.gov/" target="_blank">California's Fourth Climate Change Assessment</a> have generated hourly projections of sea level out to end of this century at selected tide gauge locations along the California coast. These hourly sea level data include contributions from:
- Astronomical tides
- Regional and local weather influences
- Shorter period climate fluctuations (e.g. El Nino and other climate patterns)
- Projections of long-term (decade to century timescale) change in regional sea levels (<a href="https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf" target="_blank">Pierce et al. 2018</a>)

The regional sea level rise projections leverage a probabilistic framework originally developed by <a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1002/2014EF000239" target="_blank">Kopp et al (2014)</a>. The probabilistic framework is helpful because despite substantial advances in the science of sea level rise, significant uncertainty remains in mid- and late-century projections of sea levels. Probabilistic sea level rise projections provide a range of possible outcomes in a framework that enables decision-makers to choose a number that is appropriate for their level of risk tolerance (e.g., a wastewater treatment plant vs. a parking lot).

Two sets of probabilistic sea level rise projections for California were generated for both RCP 4.5 and RCP 8.5 greenhouse gas emission scenarios for <a href="http://www.climateassessment.ca.gov/" target="_blank">California’s Fourth Climate Assessment</a>. Both sets of projections incorporate estimates of components that contribute to global and regional sea level rise e.g. thermal expansion of seawater, glacier ice melt, glacial isostatic adjustments, etc. However, the second set of projections also incorporates relatively recent (<a href="https://www.nature.com/articles/nature17145" target="_blank">DeConto and Pollard 2016</a>) scientific findings on the potential for rapid demise of the West Antarctic Ice Sheet, which could dramatically accelerate sea level rise in the latter decades of this century. Sea level rise scenarios include the 50th percentile (middle estimate), 95th percentile (high estimate), and 99.9th percentile (extreme estimate). Cal-Adapt currently hosts the second set of probabilistic sea level rise projections and will be adding the first set of projections used by California Ocean Protection Council's <a href="http://www.opc.ca.gov/webmaster/ftp/pdf/docs/rising-seas-in-california-an-update-on-sea-level-rise-science.pdf" target="_blank">Rising Seas</a> guidance in the near future.

A more detailed description about the hourly sea level data and probabilistic sea level rise projections are available in the technical report on <a href="http://www.climateassessment.ca.gov/techreports/docs/20180827-Projections_CCCA4-CEC-2018-006.pdf" target="_blank">Climate, Drought, and Sea Level Rise Scenarios</a> prepared for <a href="http://www.climateassessment.ca.gov/" target="_blank">California's Fourth Climate Change Assessment</a>.

## Explore projected sea levels above a threshold water level
Our first visualization using the hourly sea level projections is a chart that shows number of hours (represented as fraction of a year) sea levels are projected to be above a threshold value for 3 the different sea level rise scenarios - 50th percentile (middle estimate), 95th percentile (high estimate), and 99.9th percentile (extreme estimate). The colored ribbon for each scenario represents the range of low to high values from models selected in the Tool Settings panel. Users can compare projections between the RCP 4.5 and RCP 8.5 greenhouse gas emission scenarios by selecting the appropriate option in the Tool Settings.

<figure class="image">
  <img src="/img/blog/hourly_slr_chart.png" style="max-width:50rem;" alt="Screenshot of chart showing projected sea levels above a threshold water level">
  <figcaption></figcaption>
</figure>

## Change water level threshold
<figure class="image">
  <img src="/img/blog/hourly_slr_water_level.png" style="max-width:15rem;" alt="Screenshot of control for changing threshold value">
  <figcaption></figcaption>
</figure>

By default the threshold is the historical maximum value of sea level observed at that tide guage station. We have pre-calculated historical maximum values for all locations, e.g. for tide gauge location near San Francisco, the historical maximum is 170 cm (5.6 ft). Users can enter a different threshold by selecting User Defined from the drowdown list.

## Select tide gauge station
<figure class="image">
  <img src="/img/blog/hourly_slr_location.png" style="max-width:15rem;" alt="Screenshot of control for selecting tide gauge location">
  <figcaption></figcaption>
</figure>

Hourly projections are available for tide gauge locations along the California coastline that have a reliably continuous coastal tide gauge record beginning before 1984. Users can select a tide gauge station from the dropdown list or by clicking on the map.

####  Explore
Explore the [Hourly Sea Level Rise Projections](/tools/slr-hourly-projections/) tool. Please send us your feedback on the new Hourly Sea Level Rise Projections tool at <support@cal-adapt.org>.
