<script>
  import { onMount } from "svelte";
  import { Modal, Loading } from "carbon-components-svelte";

  export let open = false;
  export let slugs;
  export let content;
  export let header = "Learn More";

  let glossary;
  let text;

  function formatGlossaryEntries(entries) {
    return entries
      .map((item) => {
        return `
      <div>
        <h5>${item.metadata.title}</h5>
        ${item.html}
      </div>
      `;
      })
      .join("<br/>");
  }

  $: if (glossary && glossary.length) {
    if (slugs && slugs.length) {
      const matches = glossary.filter((d) => slugs.includes(d.slug));
      if (matches.length) {
        text = formatGlossaryEntries(matches);
      }
    } else if (content) {
      text = content;
    } else {
      text = "No glossary entries found";
    }
  }

  onMount(async () => {
    // Get glossary items
    glossary = await fetch("help/glossary.json")
      .then((r) => r.json())
      .then((json) => {
        return json.data;
      });
  });
</script>

<Modal
  id="learnmore"
  size="sm"
  passiveModal
  modalHeading="{header}"
  bind:open
  on:open
  on:close
>
  <div class="content">
    {#if text}
      {@html text}
    {:else}
      <Loading withOverlay="{false}" small />
    {/if}
  </div>
</Modal>
