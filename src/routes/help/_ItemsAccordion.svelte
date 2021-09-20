<script>
  import { Accordion, AccordionItem } from "carbon-components-svelte";
  export let items;
</script>

<style>
  :global(ol),
  :global(ul) {
    list-style-type: disc;
  }
</style>

<Accordion>
  {#each items as item}
    <AccordionItem title="{item.metadata.title}">
      {@html item.html}
    </AccordionItem>
  {/each}
</Accordion>
