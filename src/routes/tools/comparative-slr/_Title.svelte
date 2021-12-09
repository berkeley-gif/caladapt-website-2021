<script>
  import { Button, InlineNotification } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let location;
  export let loadLocation;
</script>

<Button
  class="btn-change-location"
  size="small"
  icon="{Location16}"
  kind="ghost"
  on:click="{loadLocation}"
>
  Change Location
</Button>

<div>
  <h2>{location}</h2>
</div>
