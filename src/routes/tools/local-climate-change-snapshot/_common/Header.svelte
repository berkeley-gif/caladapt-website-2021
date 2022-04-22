<script>
  import { goto } from "@sapper/app";
  import { Grid, Row, Column, Button } from "carbon-components-svelte";
  import { Pdf16, Location16 } from "carbon-icons-svelte";
  import { StaticMap } from "~/components/tools/Location";

  export let iconPaths = [];
  export let showDescription = true;
  export let location;

  const defaultTitleText = "Local Climate Change Snapshot";

  $: titleText = location
    ? `${defaultTitleText}:<br>${location.title}`
    : defaultTitleText;

  function generateReport() {
    // TODO...
  }

  function changeLocation() {
    // TODO: set page scroll height to select location form & map.
    goto("/tools/local-climate-change-snapshot/");
  }
</script>

<style lang="scss">
  @import "scss/site/mixins/media-queries";

  h1 {
    margin-top: 0;
  }

  .banner--icons {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-btn-container {
    display: flex;
    align-items: baseline;
    gap: 2rem;
    margin-top: 2rem;

    @include tablet {
      margin-bottom: 2rem;
    }
  }
</style>

<header>
  <Grid>
    <Row>
      <Column padding="{true}">
        <div class="banner--icons">
          {#each iconPaths as path}
            <img src="{path}" alt="" aria-hidden="true" class="icon" />
          {/each}
        </div>
      </Column>
    </Row>
    <Row>
      <Column lg="{10}" md="{8}" sm="{4}">
        <h1>{@html titleText}</h1>
        {#if !showDescription}
          <div class="header-btn-container">
            <Button on:click="{generateReport}" size="field" icon="{Pdf16}"
              >Generate Report</Button
            >
            <Button
              on:click="{changeLocation}"
              size="field"
              icon="{Location16}"
              kind="tertiary">Change Location</Button
            >
          </div>
        {/if}
      </Column>
      <Column lg="{{ span: 4, offset: 2 }}" md="{8}" sm="{4}">
        {#if !showDescription}
          <StaticMap height="{250}" location="{location}" useButton="{false}" />
        {/if}
      </Column>
    </Row>
    {#if showDescription}
      <Row>
        <Column lg="{8}" md="{8}" sm="{4}">
          <p class="lead">
            Climate change related effects vary significantly throughout
            California, mirroring our state’s diverse climate, topography, and
            ecology. This tool is a starting place if you are looking to get a
            quick sense of climate impacts in your region. The Snapshot tool
            provides climate projections for temperature, precipitation, and
            wildfire. Additional variables e.g. sea level rise will be added
            when they become available.
          </p>
        </Column>
        <Column lg="{8}" md="{8}" sm="{4}">
          <p class="lead">
            The Local Climate Change Snapshot Tool tool is designed to be
            straightforward and accessible for most users. Watch a <a
              href="https://www.youtube.com/watch?v=qcXtv2LpWr0"
              target="_blank">short video</a
            > on how to use the tool. If you want to explore the data in more depth,
            other tools on Cal-Adapt provide more configurable options.
          </p>
        </Column>
      </Row>
    {/if}
  </Grid>
</header>
