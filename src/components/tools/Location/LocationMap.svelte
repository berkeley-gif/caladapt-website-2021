<script>
  import StaticMap from "@berkeley-gif/cal-adapt-svelte-components/StaticMap/StaticMap.svelte";
  import { throttle } from "~/helpers/utilities";

  export let location = null;
  export let useButton = true;

  const throttleMs = 350;

  // this prevents too many tile requests from being made when the viewport is resized
  const setWidthActual = throttle((value) => {
    width = value;
  }, throttleMs);

  let _width = 0;
  let width = 0;
  let height = 0;

  $: _width, setWidthActual(_width);
  $: width, (height = Math.round((width * 3) / 4));
</script>

<div bind:clientWidth="{_width}">
  {#if location}
    <StaticMap
      on:click
      location="{location}"
      useButton="{useButton}"
      height="{height}"
      width="{width}"
      --border-color="var(--gray-60)"
      --stroke="var(--gray-80)"
    />
  {:else}
    <p>Loading location map...</p>
  {/if}
</div>
