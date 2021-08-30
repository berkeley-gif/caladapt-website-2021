<script>
  import { Modal, CodeSnippet } from "carbon-components-svelte";
  import copy from "clipboard-copy";

  export let open = false;
  export let state;

  $: pathname = `${window.location.origin}${window.location.pathname}`;
  $: bookmark = `${pathname}?${state}`;
</script>

<Modal id="share" passiveModal bind:open modalHeading="Share Link">
  <CodeSnippet
    type="multi"
    wrapText
    code="{bookmark}"
    on:click="{() => copy(bookmark)}"
  />
</Modal>
