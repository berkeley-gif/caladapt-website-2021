<script>
  export let useTabs = false;
  $: console.log($$slots);
  $: console.log($$props);
</script>

<div class="bx--row" class:margin--v-16="{useTabs}">
  <div class="bx--col">
    {#if useTabs}
      <slot name="tab_content_title">tab_content_title</slot>
    {:else}
      <slot name="title">chart title</slot>
    {/if}
  </div>
</div>

<div class="bx--row margin--v-16">
  <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
    {#if useTabs}
      <slot name="tab_content_stats">tab_content_stats</slot>
    {:else}
      <slot name="stats">chart stats</slot>
    {/if}
  </div>
</div>

<div class="bx--row margin--v-16">
  <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
    {#if useTabs}
      <slot name="tab_content_graphic">tab_content_graphic</slot>
    {:else}
      <slot name="graphic">chart graphic</slot>
    {/if}
  </div>
</div>
