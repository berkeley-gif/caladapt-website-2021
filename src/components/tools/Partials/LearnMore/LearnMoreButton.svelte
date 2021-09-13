<script>
  import { Button } from "carbon-components-svelte";
  import Information16 from "carbon-icons-svelte/lib/Information16";

  export let cta = "Learn More";
</script>

<Button
  icon="{Information16}"
  kind="ghost"
  size="sm"
  style="padding-left:0;"
  on:click
>
  {cta}
</Button>
