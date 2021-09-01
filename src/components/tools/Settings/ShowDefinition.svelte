<!-- TODO: When the SelectClimvar component is inside the Settings panel, the modal below does not open correctly. Most likey a clash between the position property of the Settings panel and the Modal. So for now opting to have a common modal in index.svelte  -->
<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import Information16 from "carbon-icons-svelte/lib/Information16";

  export let topics;
  export let title = "";
  export let cta = "Learn More";

  const dispatch = createEventDispatcher();
</script>

<Button
  icon="{Information16}"
  kind="ghost"
  size="sm"
  style="padding-left:0;"
  on:click="{() => dispatch('define', { topics, title })}"
>
  {cta}
</Button>
