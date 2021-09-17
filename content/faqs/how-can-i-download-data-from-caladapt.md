---
title: How can I download data from Cal-Adapt?
---

There are many ways to download data from Cal-Adapt:

*Climate tools*: All Cal-Adapt tools have a download button that you can click to download the data and graphics displayed on your screen. If you are downloading charts, you can only download one chart at a time. If you are downloading the data that compose a chart, you will only receive an export of the data that are currently displayed on the chart; any filters, date range controls, options selected, and recalculations are also applied to the exported data. So, for example, if you only display in your browser the data associated with two general circulation models (GCMs), the data file you download will only contain data for those two GCMs. To download complete and original time series, use the [data catalog](/data/download/).

*Data catalog*: All datasets available on Cal-Adapt are listed in the [data catalog](/data/download/). Search for the dataset you are interested in by entering a search criteria and/or filtering by a climate variable or data producer. You will be prompted to follow a stepwise process to identify a data format (either GeoTIFF or CSV), specify a spatial extent, set aggregation parameters, and then select from different emissions scenarios and climate models. NetCDF files for full spatial extents are available from the [Cal-Adapt file server](http://albers.cnr.berkeley.edu/data/). Links to NetCDF files are displayed on screen during the data format selection step.

*Cal-Adapt file server*: We store climate data provided by California’s scientific and research community in their original formats on the [Cal-Adapt file server](http://albers.cnr.berkeley.edu/data/). You can download NetCDF files of gridded datasets and CSV files of station data from the server. Links to individual datasets are also included in the [data catalog](/data/download/).

*Cal-Adapt API*: We process data provided by California’s scientific and research community and serve some of these through the [Cal-Adapt RESTful API](https://api.cal-adapt.org/api/). You can read the [API documentation](https://berkeley-gif.github.io/caladapt-docs/) to learn more.

*R and ArcPro packages*: You can pull data from Cal-Adapt’s API into your local environment using either Cal-Adapt’s R package (caladaptr) or Cal-Adapt’s ArcPro package. Documentation for the [caladaptr R package is here](https://ucanr-igis.github.io/caladaptr/) and documentation for the [ArcPro package is here](https://ucanr-igis.github.io/caladapt-py/). 
