<script>
  import { Button, InlineNotification } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let scenario;
  export let climvar;
  export let year;
  export let model;
  export let simulation;
  export let month;
  export let location;
  export let loadLocation;
  export let dataMsg;
  export let activeTab;

  let indicatorPeriod = "";

  $: {
    if (climvar === "fire" && simulation === "year") {
      indicatorPeriod = "Modeled Annual Area Burned";
    } else if (climvar === "fire" && simulation === "month") {
      indicatorPeriod = `Modeled ${month} Area Burned`;
    } else if (climvar === "fireprob" && simulation === "year") {
      indicatorPeriod = "Estimated Decadal Fire Probability";
    } else if (climvar === "fireprob" && simulation === "month") {
      indicatorPeriod = `Estimated ${month} Fire Probability`;
    } else {
      console.warn("Unknown indicatorPeriod for: ", climvar, simulation);
    }
  }
</script>

<div>
  {#if loadLocation}
    <Button
      class="btn-change-location"
      size="small"
      icon="{Location16}"
      kind="ghost"
      on:click="{loadLocation}"
    >
      Change Location
    </Button>
  {/if}

  {#if location}
    <div class="h3">
      {location}
    </div>
  {/if}
</div>

<div class="h4">
  {#if activeTab === 0}
    Decadal Averages Map showing
  {/if}

  <span class="annotate">{indicatorPeriod}</span>

  {#if year}
    over <span class="annotate">{year}–{year + 9}</span>
  {/if}

  under a <span class="annotate">{scenario}</span> and Central Population Growth
  scenario
  {#if model}
    for <span class="annotate">{model}</span>
  {/if}
</div>

{#if dataMsg}
  <InlineNotification
    lowContrast
    hideCloseButton
    subtitle="{dataMsg}"
    kind="warning"
  />
{/if}
