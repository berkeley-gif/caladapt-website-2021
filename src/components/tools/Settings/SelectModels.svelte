<script>
  import { createEventDispatcher } from "svelte";
  import { MultiSelect } from "carbon-components-svelte";

  import { debounce } from "../../../helpers/utilities";

  export let selectedIds;
  export let items;
  export let title = "Select Models";

  let selectedIdsArr = selectedIds.split(",");
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
</script>

<style>
  .feedback {
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
</style>

<MultiSelect
  invalid="{invalid}"
  invalidText="Choose atleast 1 GCM"
  selectedIds="{selectedIdsArr}"
  titleText="{title}"
  label="Select..."
  items="{items}"
  sortItem="{sortItem}"
  on:select="{changeSelection}"
/>
<div class="feedback">
  {feedback}
</div>
