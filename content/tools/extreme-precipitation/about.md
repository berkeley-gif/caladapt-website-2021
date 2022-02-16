<p>
  With this tool you can explore what an extreme precipitation event
  looks like by providing estimates of intensity and frequency of
  extreme precipitation events. The tools and visualizations allow you
  to examine how extreme precipitation events are likely to change in a
  warming climate over locations of interest to you.
</p>
<p>
  By default, Cal-Adapt calculates extreme values of precipitation over
  a 2-day period, and defines an extreme event as the lowest value from
  Annual Maximum values in the historical period (1961–1990). Users can
  override these defaults by selecting a new “event duration” (number of
  days over which precipitation accumulates), or by selecting a
  different “threshold“ value that corresponds to either the 90th, 95th
  or 99th percentiles. The tool displays the extreme events that
  exceed the threshold in different ways. The Frequency chart shows the
  estimated intensity of precipitation events (Return Level) for a
  selected period (Return Period) and how it changes over the historical
  period (1961–1990), mid-century (2035–2064) and end-century
  (2071–2099). The other charts display the total number of events, the
  timing of these events and the longest stretch of consecutive extreme
  events.
</p>
<p class="h3">What is a Threshold value?</p>
<p>
  The extreme threshold sets the conditions for which a precipitation
  event is considered “extreme“. By default, the threshold is set to the
  lowest annual maximum precipitation accumulation in the historical
  record (1961 to 1990). Other alternative threshold values (90th, 95th
  and 99th percentiles) are based on commonly used quantiles over the
  historical record. Selecting too high a threshold (in arid locations)
  or too low a threshold can decrease the reliability of the estimates.
</p>

<p class="h3">What is an Event Duration?</p>
<p>
  Event duration is the number of days over which precipitation falls
  that contribute to a single event. Changing this value will change the
  extreme threshold.
</p>

<p class="h3">What is a Return Period?</p>
<p>
  The return period estimates the average time between extreme events.
  This is sometimes worded as a “1 in x years” event.
</p>

<p class="h3">What is a Return Level (Estimated Intensity)?</p>
<p>
  The return level is the estimated amount of precipitation that would
  be expected to be exceeded once every return period. Effectively it is
  the inverse of the return period. Instead of wondering how often an
  extreme precipitation event will occur, we are instead considering
  once in any given time period what would extreme precipitation event
  look like? The return level is similar to the accumulated
  precipitation threshold, but is estimated from the underlying
  statistical distribution of modeled precipitation data in future
  climate scenarios. By contrast, accumulated precipitation threshold
  are calculated from historical observed values.
</p>

<p class="h3">Technical Approach</p>
<p>
  Extreme Value Theory (EVT) is a statistical methodology used for
  describing rare events. There are several ways to apply EVT to
  precipitation data inlcuding fitting a Generalized Extreme Value
  distribution (GEV) over block maxima (annual maximum value) and the
  Peaks-Over-Threshold (POT) approach where probability distribution of
  exceedances over a pre-defined threshold are modeled using a
  generalized Pareto distribution (GPD). This tool explores extreme
  events in California using a POT approach.
</p>
<p>
  Data values that exceed a high predefiend threshold, by default the
  lowest value from Annual Maximum values in the historical period
  (1961–1990), are extracted from a 30 year daily time series. If there
  are any back-to-back events only the largest such event is included. A
  generalized Pareto distribution is applied to this partial duration
  time series. Shape and scale parameters for the distribution are
  estimated using the Maximum Likelihood method. Return levels for
  selected Return Periods are estimated from the fitted model.
  Confidence intervals at the 95% level for each return level are
  estimated using the Profile Likelihood method, where sufficient (n >
  100) events exist.
</p>

<p>
  <strong>User Advisory</strong>: The Extreme Precipitation Tool is
  designed to broadly inform potential changes in extreme precipitation
  intensity and frequency across a wide range of environments and
  climate zones in California. On a local scale different statistical
  assumptions (i.e. using annual maximal values rather than partial
  duration time-series, fitting techniques for distribution parameters
  and choice of extreme value distribution) may be more appropriate. We
  encourage users to ensure the empirical fit of the applied
  distribution is acceptable to their end use before using estimates
  produced from this tool for planning purposes.
</p>

<p>
  <strong>Update (Feb 20, 2022)</strong>: Based on feedback from our users, we have updated the tool to use the 
  average of precipitation values from all intersecting grid cells for a polygon boundary before calculating metrics for the climate indicators. An earlier version of this tool used the maximum values from all intersecting grid cells which resulted in very high frequency estimates. The return levels estimates using this methodology more closely align with precipitation frequency estimates provided by NOAA.
</p>

<p class="h3">References</p>
<ul style="padding-left: 1rem;">
  <li>
    <a
      target="_blank"
      href="https://www.elsevier.com/books/statistical-methods-in-the-atmospheric-sciences/wilks/978-0-12-385022-5"
      >Wilks, D. (2011).</a
    > Statistical methods in the atmospheric sciences (3rd ed.). Oxford ;
    Waltham, MA: Academic Press.
  </li>
  <li>
    <a
      target="_blank"
      href="https://staff.ral.ucar.edu/ericg/Intro2EVT.pdf"
      >Gilleland, E. (2015).</a
    > Introduction to Extreme Value Theorem Analysis. National Center for
    Atmospheric Research.
  </li>
  <li>
    <a
      target="_blank"
      href="https://link.springer.com/book/10.1007%2F978-1-4471-3675-0"
      >Coles, S. (2001).</a
    > An introduction to statistical modeling of extreme values. London:
    Springer-Verlag. ISBN: 1-85233-459-2.
  </li>
</ul>