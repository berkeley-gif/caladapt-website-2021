<script>
  import { Button } from "carbon-components-svelte";
  import PlayFilledAlt16 from "carbon-icons-svelte/lib/PlayFilledAlt16";
  import PauseFilled16 from "carbon-icons-svelte/lib/PauseFilled16";

  import { TimeSlider } from "~/components/tools/Settings";
  import { durationStore } from "./_store";

  export function cancelAnimation() {
    window.clearInterval(timerId);
  }

  const intervalMs = 750;

  let isPlaying = false;
  let isLoading = false;
  let timerId;
  let sliderComponent;

  function multiLineLabel(selection, datum, step) {
    selection
      .append("tspan")
      .text(datum)
      .append("tspan")
      .attr("dy", 12)
      .attr("x", 0)
      .text(`–${datum + step - 1}`);
  }

  function handlePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      timerId = window.setInterval(sliderComponent.next, intervalMs);
    } else {
      window.clearInterval(timerId);
    }
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
    bind:this="{sliderComponent}"
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
