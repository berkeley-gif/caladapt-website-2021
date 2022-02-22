<script>
  import { categoryListStore } from "./_store";

  $: console.log("categories", $categoryListStore.length);
</script>
