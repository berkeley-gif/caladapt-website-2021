---
title: New Data Download Tool
author: Cal-Adapt
image: download.png
image_attrib: Image by Maret Hosemann, Pixabay
tags: tools, data
snippet: The new data download tool helps users find, select, aggregate, and download climate data for a suite of projections and variables.
---

To make the data download process faster and easier, the Cal-Adapt team has released a new data download tool which allows users to quickly filter climate datasets and download data for multiple models at a time using different spatial and temporal aggregation options.

Cal-Adapt’s new data download process grew from user input on the structures of data access and manipulation that supports climate analysis and adaptation. The tool offers a suite of new features to make data easier to discover and format. Users can now:
- Download data for multiple locations in a single process
- Temporally aggregate data with common operations (e.g. seasonal, decadal)
- Convert units
- Access additional datasets and variables (e.g. wind speed and solar radiation)
- Download multiple models and RCP scenarios.
- Search key terms to more quickly access relevant data

The new data download process contains four steps.

## 1. Search Data Catalog
To begin, users are prompted to search the data catalog using search terms and/or filters for climate variables and publishers. Alternatively, the user can select one of 14 datasets that Cal-Adapt hosts.
<figure class="image">
  <img src="/img/blog/data-download-search.png" style="max-width:50rem;" alt="Screenshot of data download search view">
  <figcaption></figcaption>
</figure>

## 2. Select Download Format
Once the user has selected the dataset of interest, she is presented with a more detailed description of the dataset and the various ways it can be downloaded. She can download the original source files (often in NetCDF format) from the Cal-Adapt Data Server and/or other servers. She can also download spatial subsets in raster or tabular formats for selected models from the Cal-Adapt API. Download formats vary by dataset.

<figure class="image">
  <img src="/img/blog/data-download-select-format.png" style="max-width:50rem;" alt="Screenshot of data download select format view">
  <figcaption></figcaption>
</figure>

## 3. Select Spatial Extent
Spatial subsetting for gridded datasets can be done in various ways:
- Draw a feature (point, line or polygon) on the map using the Draw Toolbar.
- Select a polygon from different boundary datasets like counties and census tracts
- Upload a file with spatial features (point/line/polygon).

Most common spatial data formats like GeoJSON, WKT, ESRI shapefile are supported. For ESRI shapefiles, compress the different components into a single zip file before uploading. If the user wants a raster dataset, she can upload a file with a single feature. She can download data for multiple features if she has chosen the tabular format option. CSV files with Latitude, Longitude columns are also supported for tabular downloads. There is a limit of 10 lines/polygons or 20 points per file. If user has more locations, she can divide the locations into separate files and repeat step 3 & 4 for each file.

The user will receive feedback on whether selected extent is supported by the Cal-Adapt API before moving on to the next step.

For station based datasets, the user does not need to select a spatial extent. Instead she will skip this step and select the stations directly in the next step.

<figure class="image">
  <img src="/img/blog/data-download-select-extent.png" style="max-width:50rem;" alt="Screenshot of data download select extent view">
  <figcaption></figcaption>
</figure>

## 4. Select Series & Download
In the final step, the user is presented with a list of all the timeseries available for selected dataset through the Cal-Adapt API. She can select up to 10 series at a time to download. If she wants more data, she will need to clear the previous series selection after downloading and select again. Some of our datasets have hundreds of individual time series with various combinations of climate variables, scenarios and/or GCMs! To make it easier to find data, use the dropdown filters to narrow down the list presented in the table.

The user can select up to 10 series at a time. Since more of our users prefer downloading data in a tabular format, we have additional temporal aggregations to choose from if the user has selected the Tabular Format option. After selecting the series and any aggregation options the user can click on the download button to send a request to the Cal-Adapt API. The server will return a zip file with data when it’s ready.
<figure class="image">
  <img src="/img/blog/data-download-select-series.png" style="max-width:50rem;" class="mx-auto d-block" alt="Screenshot of data download select extent view">
  <figcaption></figcaption>
</figure>

## Enhanced Data Access, Enhanced Adaptation

The Cal-Adapt team hopes that these new features and interface help citizens, public officials, and scientists across California envision, prepare for, and communicate about climate change. To support engagement with this data download tool, Cal-Adapt staff will offer a brief [webinar on June 27, 2019](/events/webinar-accessing-climate-data).

If additional data and functionality would support your climate science and planning goals, please get in touch! You can reach us by emailing <support@cal-adapt.org>
