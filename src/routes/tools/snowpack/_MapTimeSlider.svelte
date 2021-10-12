<script>
  import { range } from "d3-array";
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import PlayFilledAlt16 from "carbon-icons-svelte/lib/PlayFilledAlt16";
  import PauseFilled16 from "carbon-icons-svelte/lib/PauseFilled16";

  import { TimeSlider } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { getMapImages } from "./_helpers";

  export function cancelAnimation() {
    window.clearInterval(timerId);
  }
  export let climvarId;
  export let modelId;
  export let scenarioId;
  export let monthNumber;
  export let duration;

  const intervalMs = 750;
  const dispatch = createEventDispatcher();

  let isPlaying = false;
  let isLoading = false;
  let timerId;
  let sliderComponent;

  $: years = range(1960, 2100, duration);

  $: imagePaths = getMapImages({
    climvarId,
    modelId,
    scenarioId,
    duration,
    years,
    monthNumber,
  });
  $: imagePaths, preloadAllImages(imagePaths);

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

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = src;
    });
  }

  async function preloadAllImages(imagesData) {
    isLoading = true;
    try {
      await Promise.all(imagesData.map((url) => preloadImage(url.src)));
    } catch (error) {
      console.warn(error.message);
    } finally {
      isLoading = false;
    }
  }

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }
</script>

<style>
  div {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
</style>

<div>
  <TimeSlider
    bind:this="{sliderComponent}"
    intervals="{years}"
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
<LearnMoreButton
  on:click="{() =>
    showLearnMore({
      content: 'TODO: something about livneh & models both being used here?',
    })}"
/>
