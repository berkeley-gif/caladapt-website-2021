<script>
  import { onMount } from "svelte";
  import { DL_Cosmos, DL_Calflod5m, DL_Calflod50m } from "../_constants";
  import { getGeoJson } from "../_data";

  const layers = [DL_Cosmos, DL_Calflod5m, DL_Calflod50m];

  let data = [];

  $: console.log(data);

  onMount(async () => {
    try {
      data = await getGeoJson(layers);
    } catch (error) {
      console.log(error);
    }
  });
</script>
