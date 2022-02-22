<script>
  import { indicatorStore } from "./_store";

  $: console.log("indicator", $indicatorStore.id);
</script>
