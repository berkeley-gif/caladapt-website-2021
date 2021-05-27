<script>
  import { Button } from 'carbon-components-svelte';
  import { ArrowUp32 } from 'carbon-icons-svelte';

  export let showOnPx = 150;
  let hidden = false;

  function goTop() {
    document.body.scrollIntoView();
  }

  function scrollContainer() {
    return document.documentElement || document.body;
  }

  function handleOnScroll() {
    if (!scrollContainer()) {
      return;
    }

    if (scrollContainer().scrollTop > showOnPx) {
      hidden = true;
    } else {
      hidden = false;
    }
  }
</script>

<svelte:window on:scroll={handleOnScroll} />

<div class="back-to-top" on:click={goTop} class:hidden>
  <Button
    tooltipPosition="left"
    tooltipAlignment="end"
    iconDescription="Back to top"
    icon={ArrowUp32}
  />
</div>