<script>
  import { onMount } from "svelte";
  import { parseCssValue } from "./annotationUtils.js";

  export let annotations;
  export let xGet;
  export let yGet;

  const vals = ["top", "right", "bottom", "left"];

  $: labels = annotations.map((d) => d.label);

  $: setStyle = (label) => {
    const { position, data, style } = label;
    let inlineStyle = "";

    if (position) {
      vals.forEach((val) => {
        if (position[val]) {
          inlineStyle += `${val}: ${position[val]};`;
        }
      });
    }

    if (data) {
      inlineStyle = `top: ${yGet(data)}px;left: ${xGet(data)}px;`;
    }

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
      <div class="annotation-label" data-id="{i}" style="{setStyle(d)}">
        {d.text}
      </div>
    {/each}
  {/if}
</div>
