<script>
  import { Button, Tag } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";

  export let event;
  export let isFutureEvent = false;

  const tagColor = new Map([
    ["webinar", "teal"],
    ["workshop", "green"],
    [undefined, "gray"],
  ]);

  $: metadata = event.metadata;
  $: slug = event.slug;
  $: tags = metadata.tags;
  $: location = metadata.location;
  $: time = metadata.time;
  $: title = metadata.title;
  $: datestring = metadata.eventdatestring;
  $: teaser = metadata.teaser;
</script>

<style>
  .bx--row:not(:last-child) {
    margin-bottom: 4rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 0;
  }

  .tag-chips,
  p:not(.teaser) {
    margin: 0;
  }

  .tag-chips {
    display: flex;
    text-transform: capitalize;
  }

  p:not(.teaser) {
    font-size: 0.875rem;
    color: var(--gray-80);
  }

  .date-tags-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p.teaser {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }

  .button-container {
    margin-top: 1rem;
  }
</style>

<!-- Note: the listitem ARIA role registers this as an <li> in the accessibility tree. 
    This means the component's immediate parent must have role=list -->
<div class="bx--row" role="listitem">
  <div class="bx--col">
    <h3>{title}</h3>

    <div class="date-tags-container">
      <p class="datestring">{datestring}</p>

      {#if Array.isArray(tags) && tags.length}
        <div class="tag-chips">
          {#each tags as tag}
            <Tag size="sm" type="{tagColor.get(tag)}">{tag}</Tag>
          {/each}
        </div>
      {/if}
    </div>

    {#if isFutureEvent}
      <p class="location-time">{location} from {time}</p>
    {/if}

    {#if teaser}
      <p class="teaser">{teaser}</p>
    {/if}

    <div class="button-container">
      {#if isFutureEvent}
        <Button
          href="/events/{slug}"
          kind="tertiary"
          size="field"
          aria-label="View details for upcoming event {title}"
          icon="{ArrowRight16}">Register</Button
        >
      {:else}
        <Button
          href="/events/{slug}"
          kind="tertiary"
          size="small"
          aria-label="View details for previous event {title}"
          >Event Details</Button
        >
      {/if}
    </div>
  </div>
</div>
