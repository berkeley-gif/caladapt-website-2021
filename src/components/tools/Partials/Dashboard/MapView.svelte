<script>
  export let useTabs = false;
</script>

<div class="bx--row" class:margin--v-16="{useTabs}">
  <div class="bx--col">
    {#if useTabs}
      <slot name="tab_content_map_title">tab_content_map_title</slot>
    {:else}
      <slot name="title">map title</slot>
    {/if}
  </div>
</div>

<div class="bx--row margin--v-16">
  <div class="bx--col">
    {#if useTabs}
      <slot name="tab_content_slippy_map">tab_content_slippy_map</slot>
    {:else}
      <slot name="slippy_map">slippy_map</slot>
    {/if}
  </div>
</div>

<div class="bx--row" class:margin--v-16="{!useTabs}">
  <div class="bx--col">
    {#if useTabs}
      <slot name="tab_content_slippy_map_controls" />
    {:else}
      <slot name="slippy_map_controls" />
    {/if}
  </div>
</div>
