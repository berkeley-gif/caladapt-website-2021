<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    Select,
    SelectItem,
    SkeletonPlaceholder,
  } from "carbon-components-svelte";

  export let selectedId;
  export let items;
  export let title = "SELECT STATION";

  const dispatch = createEventDispatcher();

  let selected = items.find((d) => d.id === selectedId);
  let ready = false;

  function change(e) {
    selected = items.find((d) => d.id === +e.detail);
    dispatch("change", selected);
  }

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

{#if ready}
  <Select
    class="station-select"
    labelText="{title}"
    selected="{selectedId}"
    on:change="{change}"
  >
    {#each items as opt}
      <SelectItem value="{opt.id}" text="{opt.properties.name}" />
    {/each}
  </Select>
{:else}
  <SkeletonPlaceholder style="height:20px;margin-top:5px;" />
{/if}
