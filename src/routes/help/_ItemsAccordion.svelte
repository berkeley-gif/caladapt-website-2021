<script>
  import { onMount, afterUpdate } from "svelte";
  import { Accordion, AccordionItem } from "carbon-components-svelte";
  export let items;

  $: hash = "";
  $: isOpen = (title) => makeId(title) === hash;

  function makeId(string) {
    return string.split(" ").join("-").toLowerCase();
  }

  function getLocationHashText() {
    if (window.location.hash) {
      return window.location.hash.replace("#", "");
    }
  }

  onMount(() => {
    hash = getLocationHashText();
    window.addEventListener(
      "hashchange",
      () => {
        hash = getLocationHashText();
      },
      false
    );
  });

  afterUpdate(() => {
    if (document.getElementById(`${hash}`)) {
      document.getElementById(`${hash}`).scrollIntoView();
    }
  });
</script>

<style>
  :global(ol),
  :global(ul) {
    list-style-type: disc;
  }
  h2 {
    margin: 0;
  }
</style>

<Accordion>
  {#each items as { metadata, html }}
    <AccordionItem open="{isOpen(metadata.title)}">
      <div slot="title">
        <h2 id="{makeId(metadata.title)}" class="bx--accordion__title">
          {metadata.title}
        </h2>
      </div>
      {@html html}
    </AccordionItem>
  {/each}
</Accordion>
