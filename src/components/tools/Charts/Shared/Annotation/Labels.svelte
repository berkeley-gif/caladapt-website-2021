<script>
  // Labels are divs with text nodes placed in an Absolutely positioned parent div
  // Based on annotated column example from LayerCake
  // https://layercake.graphics/example/Column
  import { onMount } from "svelte";
  import { parseCssValue } from "./annotationUtils.js";

  export let annotations;
  export let xGet;
  export let yGet;

  const vals = ["top", "right", "bottom", "left"];

  $: labels = annotations.map((d) => d.label);

  $: setPositionAndStyle = (label) => {
    const { position, data, style } = label;
    let inlineStyle = "";

    // Set label position
    if (position) {
      // x,y values correspond to pixel values expressed in numbers or percentages
      vals.forEach((val) => {
        if (position[val]) {
          inlineStyle += `${val}: ${position[val]};`;
        }
      });
    } else if (data) {
      // x,y values correspond to a data object
      // use the accessor functions to derive pixel values
      inlineStyle = `top: ${yGet(data)}px;left: ${xGet(data)}px;`;
    } else {
      // default position
      inlineStyle = `top:0;left:0`;
    }

    // Add any custom styles for label e.g. { color: "red" }
    // This will override default css properties
    if (style) {
      inlineStyle = Object.entries(style)
        .map(([key, value]) => `--${key}:${value}`)
        .join(";");
    }

    return inlineStyle;
  };
</script>

<style>
  .annotation-label {
    position: absolute;
    max-width: var(--max-width, 200px);
    color: var(--color, var(--gray-80));
    font-size: var(--font-size, 1rem);
    background: var(--background, rgba(255, 255, 255, 0.7));
    padding: var(--padding, 2px);
  }
</style>

<div class="layercake-annotations">
  {#if Array.isArray(labels) && labels.length}
    {#each labels as d, i}
      <div
        class="annotation-label"
        data-id="{i}"
        style="{setPositionAndStyle(d)}"
      >
        {d.text}
      </div>
    {/each}
  {/if}
</div>
