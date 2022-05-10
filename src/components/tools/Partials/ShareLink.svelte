<script>
  import {
    Modal,
    CodeSnippet,
    InlineNotification,
  } from "carbon-components-svelte";
  import copy from "clipboard-copy";

  export let open = false;
  export let state;
  export let errorMsg = "";

  $: pathname = `${window.location.origin}${window.location.pathname}`;
  $: bookmark = `${pathname}?${state}`;
</script>

<Modal id="share" passiveModal bind:open modalHeading="Share Link">
  {#if errorMsg}
    <InlineNotification
      lowContrast="{true}"
      kind="warning"
      title="Warning:"
      subtitle="{errorMsg}"
    />
  {:else}
    <CodeSnippet
      type="multi"
      wrapText
      code="{bookmark}"
      on:click="{() => copy(bookmark)}"
    />
  {/if}
</Modal>
