<script>
  import { Button, InlineNotification } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";
  import { getCSSProp } from "~/helpers/utilities";

  export let floodScenario;
  export let timeFrame;
  export let dataLayers;
  export let dataUnavailableMsg = "";

  $: visibleLayers = dataLayers.filter((d) => d.checked);
  $: layerHtml = getLayerHtml(visibleLayers);

  const getLayerHtml = (layers) => {
    const html = layers.map(
      ({ label, color }) =>
        `<span class="annotate annotate-color" style="background:${getCSSProp(
          document.documentElement,
          color.replace("rs", "--rs-")
        )};">${label}</span>`
    );
    if (html.length) {
      return `Showing available data for ${html.join(" and ")} under a`;
    } else {
      return "No data layers shown for a";
    }
  };
</script>

<style>
  div :global(span.annotate-color) {
    display: inline-block;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
</style>

<div>
  <p class="h4">
    {@html layerHtml}
    <span class="annotate">{floodScenario}</span>
    flood scenario for the <span class="annotate">{timeFrame}</span> period.
  </p>
</div>

{#if dataUnavailableMsg}
  <InlineNotification
    lowContrast
    hideCloseButton
    subtitle="{dataUnavailableMsg}"
    kind="warning"
  />
{/if}
