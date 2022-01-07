<script>
  export let useTabs = false;
</script>

<!-- Chart slots -->
{#if $$slots.chart_title}
  <div class="bx--row" class:margin--v-16="{useTabs}">
    <div class="bx--col">
      <slot name="chart_title">chart title</slot>
    </div>
  </div>
{/if}

{#if $$slots.stats}
  <div class="bx--row margin--v-16">
    <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
      <slot name="stats">chart stats</slot>
    </div>
  </div>
{/if}

{#if $$slots.graphic}
  <div class="bx--row margin--v-16">
    <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
      <slot name="graphic">chart graphic</slot>
    </div>
  </div>
{/if}

<!-- Map slots -->
{#if $$slots.map_title}
  <div class="bx--row" class:margin--v-16="{useTabs}">
    <div class="bx--col">
      <slot name="map_title">map title</slot>
    </div>
  </div>
{/if}

{#if $$slots.slippy_map}
  <div class="bx--row margin--v-16">
    <div class="bx--col">
      <slot name="slippy_map">slippy_map</slot>
    </div>
  </div>
{/if}

{#if $$slots.slippy_map_controls}
  <div class="bx--row" class:margin--v-16="{!useTabs}">
    <div class="bx--col">
      <slot name="slippy_map_controls">slippy_map_controls</slot>
    </div>
  </div>
{/if}
