<script>
  import { Button } from "carbon-components-svelte";
  import PlayFilledAlt16 from "carbon-icons-svelte/lib/PlayFilledAlt16";
  import PauseFilled16 from "carbon-icons-svelte/lib/PauseFilled16";

  import { TimeSlider } from "~/components/tools/Settings";
  import { durationStore } from "./_store";

  export let isLoading;

  let isPlaying = false;

  function multiLineLabel(selection, datum) {
    selection
      .append("tspan")
      .text(datum)
      .append("tspan")
      .attr("dy", 12)
      .attr("x", 0)
      .text(`–${datum + 9}`);
  }

  function handlePlayPause() {
    isPlaying = !isPlaying;
  }
</script>

<style>
  div {
    display: flex;
    gap: 1rem;
  }
</style>

<div>
  <TimeSlider
    start="{1960}"
    end="{2100}"
    step="{$durationStore}"
    labelFn="{multiLineLabel}"
    on:change
  />
  <Button
    disabled="{isLoading}"
    iconDescription="{isPlaying ? 'Pause' : 'Play'}"
    icon="{isPlaying ? PauseFilled16 : PlayFilledAlt16}"
    on:click="{handlePlayPause}"
  />
</div>
