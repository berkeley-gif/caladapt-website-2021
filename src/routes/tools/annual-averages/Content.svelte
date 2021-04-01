<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    Search,
    SkeletonText,
    Button,
    Modal,
  } from 'carbon-components-svelte';
  import { format } from 'd3-format';
  import Upload16 from 'carbon-icons-svelte/lib/Upload16';
  import Download16 from 'carbon-icons-svelte/lib/Download16';
  import html2canvas from 'html2canvas';
  import { saveAs } from 'file-saver';

  // Helpers
  import { getLocation, searchLocation } from '../../../helpers/geocode';
  import { boundaryList } from './_helpers';

  // Components
  import {
    SelectBoundary,
    UploadBoundary,
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import { LineAreaChart } from '../../../components/tools/Charts';
  import { MinMaxAvg } from '../../../components/tools/Stats';
  import DownloadChart from '../../../components/tools/DownloadChart.svelte';

  // Store
  import { climvarStore, scenarioStore, locationStore, dataStore } from './_store';

  const dispatch = createEventDispatcher();
  const { location, boundary, lngLat } = locationStore;
  const { data } = dataStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  let observedSeries;
  let modelSeries;
  let mapReady = false;
  let showUpload = false;
  let showDownload = false;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;

  $: if (mapReady) {
    dispatch('ready');
  }

  $: formatFn = format(`.${$climvar.decimals}f`);
  $: if ($data) {
    observedSeries = $data.filter(d => d.key === 'observed');
    modelSeries = $data.filter(d => d.key !== 'observed');
  }

  async function mapClick(e) {
    const loc = await getLocation(e.detail[0], e.detail[1], $boundary.id);
    locationStore.updateLocation(loc);
  }

  function clearSearch() {
    searchOptions.length = 0;
    searchValue = '';
  }

  async function search(e) {
    searchOptions = await searchLocation(e.target.value, $boundary.id);
    showSuggestions = true;
  }

  async function changeBoundary(e) {
    locationStore.updateBoundary(e.detail.id);
    searchPlaceholder = `Enter ${$boundary.metadata.placeholder}`;
    const loc = await getLocation($lngLat[0], $lngLat[1], e.detail.id);
    locationStore.updateLocation(loc);
  }

  function selectSuggestion(opt) {
    showSuggestions = false;
    console.log('selectSuggestion', opt);
    if (opt) {
      locationStore.updateLocation(opt);
    }
    clearSearch();
  }

  function uploadBoundary(e) {
    console.log('uploadBoundary', e.detail);
    locationStore.updateBoundary('locagrid');
    locationStore.updateLocation(e.detail.location, true);
    showUpload = false;
  }

  function downloadViz(e) {
    console.log('download boundary', e.detail);
    showDownload = false;
    const chartContainer = document.querySelector('.layercake-layout-svg');
    console.log(chartContainer);
    // html2canvas(chartContainer, { useCORS: true }).then((canvas) => {
    //   const a = document.createElement('a');
    //   a.download = 'chart.png';
    //   a.href = canvas.toDataURL('image/png');
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    // });
    var svgString = getSVGString(chartContainer);
    svgString2Image( svgString, 600, 450, 'png', save ); // passes Blob and filesize String to the callback

    function save( dataBlob, filesize ){
      saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
    }
  }


  // Below are the functions that handle actual exporting:
  // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
  function getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles( svgNode );
    appendCSS( cssStyleText, svgNode );

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles( parentElement ) {
      var selectorTextArr = [];

      // Add Parent element Id and Classes to the list
      selectorTextArr.push( '#'+parentElement.id );
      for (var c = 0; c < parentElement.classList.length; c++)
          if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
            selectorTextArr.push( '.'+parentElement.classList[c] );

      // Add Children element Ids and Classes to the list
      var nodes = parentElement.getElementsByTagName("*");
      for (var i = 0; i < nodes.length; i++) {
        var id = nodes[i].id;
        if ( !contains('#'+id, selectorTextArr) )
          selectorTextArr.push( '#'+id );

        var classes = nodes[i].classList;
        for (var c = 0; c < classes.length; c++)
          if ( !contains('.'+classes[c], selectorTextArr) )
            selectorTextArr.push( '.'+classes[c] );
      }

      // Extract CSS Rules
      var extractedCSSText = "";
      for (var i = 0; i < document.styleSheets.length; i++) {
        var s = document.styleSheets[i];
        
        try {
            if(!s.cssRules) continue;
        } catch( e ) {
              if(e.name !== 'SecurityError') throw e; // for Firefox
              continue;
            }

        var cssRules = s.cssRules;
        for (var r = 0; r < cssRules.length; r++) {
          if ( contains( cssRules[r].selectorText, selectorTextArr ) )
            extractedCSSText += cssRules[r].cssText;
        }
      }
      

      return extractedCSSText;

      function contains(str,arr) {
        return arr.indexOf( str ) === -1 ? false : true;
      }

    }

    function appendCSS( cssText, element ) {
      var styleElement = document.createElement("style");
      styleElement.setAttribute("type","text/css"); 
      styleElement.innerHTML = cssText;
      var refNode = element.hasChildNodes() ? element.children[0] : null;
      element.insertBefore( styleElement, refNode );
    }
  }


  function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function() {
      context.clearRect ( 0, 0, width, height );
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob( function(blob) {
        var filesize = Math.round( blob.length/1024 ) + ' KB';
        if ( callback ) callback( blob, filesize );
      });

      
    };

    image.src = imgsrc;
  }

  onMount(() => {
    console.log('mount content');
  })
</script>

<style lang="scss">
  .content-header {
    display: flex;
    align-items: center;
  }
</style>

<div class="content-grid">
  <!-- Climvar Header -->
  <div class="content-header block">
    {#if $climvar}
      <span class="icon">{ @html $climvar.icon }</span>
      <h4 class="title">{$climvar.title}</h4>
    {:else}
      <SkeletonText heading />
      <SkeletonText />
    {/if}         
  </div> <!-- end content-header -->

  <!-- Stats -->
  <div class="content-stats block">
    <MinMaxAvg
      title={'Observed Data'}
      subtitle={'Baseline (1961-1990)'}
      note={`Values in ${$climvar.units.imperial}`}
      data={observedSeries}
      historicalOnly={true}
      start={1961}
      end={1990}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <div class="content-stats block">    
    <MinMaxAvg
      title={'Model Projections'}
      subtitle={'Mid-Century (2035-2064)'}
      note={`Values in ${$climvar.units.imperial}`}
      data={modelSeries}
      start={2035}
      end={2064}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <div class="content-stats block">     
    <MinMaxAvg
      title={'Model Projections'}
      subtitle={'End-Century (2070-2099)'}
      note={`Values in ${$climvar.units.imperial}`}
      data={modelSeries}
      start={2070}
      end={2099}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <!-- Boundary Selection -->
  <div class="content-boundary block">
    <SelectBoundary 
      selectedId={$boundary.id}
      items={boundaryList}
      addStateBoundary={true}
      on:change={changeBoundary}
    />
    <div class="boundary-upload">
      <ShowDefinition
       topics={["aggregation-boundary"]}
       title="Aggregating Data by Boundary"
       on:define />
      <Button
        icon={Upload16}
        size="small"
        on:click={() => showUpload = true}>
        Upload
      </Button>      
    </div>
  </div> <!-- end content-boundary -->

  <!-- Map-->
  <div class="content-map">
    <div class="location-search">
      <Search
        size="sm"
        placeholder={searchPlaceholder} 
        on:change={search}
        bind:value={searchValue}
      />
      {#if showSuggestions }
        <div class="suggestions-wrapper">
          <ul class="suggestions">
            {#if searchOptions && searchOptions.length > 0}
              {#each searchOptions as opt}
                <li>
                  <div class="suggestion" on:click={() => selectSuggestion(opt)}>
                    <div class="suggestion-title">{opt.title}</div>
                    <div class="suggestion-address">{opt.address}</div>
                  </div>
                </li>
              {/each}
            {:else}
              <li>
                <div class="suggestion" on:click={() => selectSuggestion()}>
                  <div class="suggestion-nodata">No Results Found</div>
                </div>
              </li>
            {/if}
          </ul>
        </div>
      {/if}
    </div>
    <Location
      lng={$locationStore.lng}
      lat={$locationStore.lat}
      boundary={$boundary}
      location={$location}
      on:mapclick={mapClick}
      on:ready={() => mapReady = true} />    
  </div> <!-- end content-map -->

  <!-- Chart-->
  <div class="content-chart block">
    <div>
      {#if $location}
        <span class="chart-title">
          {$location.title}, {$location.address}
        </span>
        <span class="chart-subtitle">{$scenario.labelLong}</span>
      {:else}
        <SkeletonText heading />
        <SkeletonText />
      {/if}
    </div>
    <div style="height:450px;">
      <LineAreaChart
        data={$data}
        yAxis = {{
          key: 'value',
          label: `${$climvar.title}`,
          tickFormat: formatFn,
          units: `${$climvar.units.imperial}`,
        }}
      /> 
    </div>

    <div class="chart-download">
      <ShowDefinition
       topics={["chart"]}
       title="Chart"
       on:define />
      <Button
        icon={Download16}
        size="small"
        on:click={() => showDownload = true}>
        Download
      </Button> 
    </div>       
  </div> <!-- end content-chart -->


</div>

<Modal id="upload"
  bind:open={showUpload}
  modalHeading=""
  passiveModal 
  on:open
  on:close
>
  <UploadBoundary bind:open={showUpload} on:upload={uploadBoundary} />
</Modal>

<DownloadChart bind:open={showDownload} on:download={downloadViz} />
