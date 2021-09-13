<script>
  import { createEventDispatcher } from "svelte";
  import { Select, SelectItem } from "carbon-components-svelte";

  export let selectedId;
  export let items;
  export let addStateBoundary = false;
  export let title = "Aggregate Data By Boundary";

  const dispatch = createEventDispatcher();

  if (addStateBoundary) {
    items.push({
      id: "ca",
      type: "line",
      label: "State of California",
      metadata: {
        group: "Boundaries",
        title: "State of California",
        placeholder: "",
      },
      source: {
        type: "vector",
        tiles: ["https://api.cal-adapt.org/vtiles/locagrid/{z}/{x}/{y}.pbf"],
        minzoom: 1,
        maxzoom: 20,
      },
      "source-layer": "locagrid",
      layout: {
        "line-cap": "round",
        "line-join": "round",
        visibility: "none",
      },
      paint: {
        "line-opacity": 0.75,
        "line-color": "rgb(107 231 186)",
        "line-width": 1,
      },
    });
  }

  let selected = items.find((d) => d.id === selectedId);

  function change(e) {
    selected = items.find((d) => d.id === e.detail);
    dispatch("change", selected);
  }
</script>

<Select
  class="boundary-select"
  labelText="{title}"
  selected="{selectedId}"
  on:change="{change}"
>
  {#each items as opt}
    <SelectItem value="{opt.id}" label="{opt.label}" />
  {/each}
</Select>
