<script>
  import { ClickableTile } from "carbon-components-svelte";

  // Props
  export let items = [];
</script>

<!-- Resources -->
<div class="bx--row">
  <div class="bx--col-lg-12">
    <h2>Help</h2>
    <slot name="help">
      {#if !items || items.length === 0}
        <em>[Provide a list of Help items for the tool]</em>
      {:else}
        {#each items as opt}
          <div class="bx--row">
            <div class="bx--col">
              <ClickableTile href="{opt.link}" class="center-row">
                <div class="center">
                  <img
                    style="width:300px;"
                    src="/img/{opt.image}"
                    alt="scripps logo"
                  />
                </div>
                <div style="padding:1rem 5rem 1rem 1rem;">
                  <h4>{opt.title}</h4>
                  <p>{opt.desc}</p>
                </div>
              </ClickableTile>
            </div>
          </div>
        {/each}
      {/if}
    </slot>
  </div>
</div>
