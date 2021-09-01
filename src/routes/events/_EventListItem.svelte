<script>
  import { Button } from "carbon-components-svelte";

  export let event;
  export let isFutureEvent = false;

  $: metadata = event.metadata;
  $: slug = event.slug;
  $: image = metadata.image;
  $: tags = metadata.tags;
  $: location = metadata.location;
  $: pubdate = metadata.pubdate;
  $: time = metadata.time;
  $: title = metadata.title;
  $: datestring = metadata.eventdatestring;
</script>

<style>
  .bx--row:not(:last-child) {
    margin-bottom: 2rem;
  }
</style>

<!-- Note: the listitem ARIA role registers this as an <li> in the accessibility tree. 
    This means the component's immediate parent must have role=list -->
<div class="bx--row" role="listitem">
  <div class="bx--col-lg-2"></div>
  <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
    <h3>{title}</h3>
    <p>{datestring}</p>
    <p>{time}</p>
    {#if isFutureEvent}
      <Button href="{slug}" kind="tertiary">Register</Button>
    {:else}
      <Button href="{slug}" kind="tertiary">Event Details</Button>
    {/if}
  </div>
  <div class="bx--col-lg-5"></div>
</div>
