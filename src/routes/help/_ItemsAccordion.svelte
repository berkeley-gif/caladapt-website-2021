<script>
  import { Accordion, AccordionItem } from 'carbon-components-svelte';

  export let items;
</script>

<Accordion>
  {#each items as item}
    <AccordionItem title={item.metadata.title}>
      { @html item.html }
    </AccordionItem>
  {/each}
</Accordion>