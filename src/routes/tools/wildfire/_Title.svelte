<script>
  import { Button } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let scenario;
  export let climvar;
  export let year;
  export let model;
  export let period;
  export let month;
  export let location;
  export let loadLocation;

  let indicatorPeriod;

  $: {
    if (climvar === "fire" && period === "year") {
      indicatorPeriod = "Modeled Annual Area Burned";
    } else if (climvar === "fire" && period === "month") {
      indicatorPeriod = `Modeled ${month} Area Burned`;
    } else if (climvar === "fireprob" && period === "year") {
      indicatorPeriod = "Estimated Decadal Fire Probability";
    } else if (climvar === "fireprob" && period === "month") {
      indicatorPeriod = `Estimated ${month} Fire Probability`;
    } else {
      throw new Error("Unknown indicatorPeriod");
    }
  }
</script>

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

<div class="h4">
  <span class="annotate">{indicatorPeriod}</span>

  {#if year}
    over <span class="annotate">{year} – {year + 9}</span>
  {/if}

  under a {scenario} and Central Population Growth scenario

  {#if model}
    for <span class="annotate">{model}</span>
  {/if}.
</div>
