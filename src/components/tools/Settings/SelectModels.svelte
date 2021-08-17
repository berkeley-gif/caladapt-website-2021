<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { MultiSelect, SelectSkeleton } from "carbon-components-svelte";

  import { debounce } from "../../../helpers/utilities";

  export let selectedIds;
  export let items;

  let selectedIdsArr = selectedIds.split(",");
  let ready = false;
  let invalid = false;
  const dispatch = createEventDispatcher();
  const sortItem = (a, b) => a.order - b.order;

  const formatSelected = (arr) => {
    if (arr.length === 0) {
      return "No models selected";
    }
    return arr.join(", ");
  };

  const changeSelection = debounce((e) => {
    selectedIdsArr = e.detail.selectedIds;
    if (selectedIdsArr.length === 0) {
      invalid = true;
    } else {
      invalid = false;

      dispatch("change", e.detail);
    }
  }, 1000);

  $: feedback = formatSelected(selectedIdsArr);

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<style>
</style>

{#if ready}
  <MultiSelect
    invalid="{invalid}"
    invalidText="Choose atleast 1 GCM"
    selectedIds="{selectedIdsArr}"
    titleText=""
    label="Select..."
    items="{items}"
    sortItem="{sortItem}"
    on:select="{changeSelection}"
  />
{:else}
  <SelectSkeleton />
{/if}

<div class="font-size-sm mt-2">
  {feedback}
</div>
