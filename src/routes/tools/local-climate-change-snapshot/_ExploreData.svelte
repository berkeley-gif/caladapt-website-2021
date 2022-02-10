<script>
  // Components
  import LocationTitle from "./_LocationTitle.svelte";
  import SelectCategory from "./_SelectCategory.svelte";
  import SelectIndicator from "./_SelectIndicator.svelte";
  import Chart from "./_DataChart.svelte";
  import Snapshot from "./_DataSnapshot.svelte";
  import DataNotes from "./_DataNotes.svelte";
  import CategoryResources from "./_CategoryResources.svelte";

  export let categories;
  export let indicators;
</script>

<LocationTitle />
<SelectCategory categories="{categories}" />
<SelectIndicator indicators="{indicators}" />
<Chart />
<Snapshot />
<DataNotes />
<CategoryResources />
