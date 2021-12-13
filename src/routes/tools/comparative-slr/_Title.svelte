<script>
  import { Button, InlineNotification } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";
  import { getCSSProp } from "~/helpers/utilities";

  export let location;
  export let loadLocation;
  export let floodScenario;
  export let timeFrame;
  export let dataLayers;

  $: visibleLayers = dataLayers.filter((d) => d.checked);
  $: layerHtml = getLayerHtml(visibleLayers);

  const getLayerHtml = (layers) => {
    const html = layers.map(
      ({ label, color }) =>
        `<span class="annotate" style="display:inline-block;background:${getCSSProp(
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

<Button
  class="btn-change-location"
  size="small"
  icon="{Location16}"
  kind="ghost"
  on:click="{loadLocation}"
>
  Change Location
</Button>

<div>
  <h2>{location}</h2>
  <p class="h4">
    {@html layerHtml}
    <span class="annotate">{floodScenario}</span>
    flood scenario for the years <span class="annotate">{timeFrame}</span>.
  </p>
</div>
