<script>
  import { getContext } from "svelte";

  const { xGet, yGet } = getContext("LayerCake");

  export let lineData;
  export let colorScale = (d) => "#000";
  export let displayItems;

  $: path = (values) => {
    return (
      "M" +
      values
        .map((d) => {
          return $xGet(d) + "," + $yGet(d);
        })
        .join("L")
    );
  };

  $: showItems = displayItems.map((d) => d.show);
</script>

<style>
  .path-line {
    opacity: 0;
  }

  .show {
    opacity: 1;
  }
</style>

<g class="line-group">
  {#each lineData as group, i}
    <path
      class="path-line"
      class:show="{showItems[i] ? true : false}"
      d="{path(group.values)}"
      stroke="{colorScale(group.values[0].key)}"
      fill="none"
      stroke-width="2px"
    >
    </path>
  {/each}
</g>
