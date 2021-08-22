<script>
  import { ClickableTile } from "carbon-components-svelte";

  // Props
  export let resources = [];

  $: tools = resources.filter((d) => d.category === "caladapt");
  $: other = resources.filter((d) => d.category === "external");
</script>

<div class="bx--grid">
  <!-- Resources -->
  <div class="bx--row">
    <div class="bx--col-lg-12">
      <h2>Resources</h2>
      <slot name="resources">
        <p>
          The following list of datasets were used to create this tool. Download
          data visualized in the charts by clicking the Download Chart button.
          For more download options follow the links below.
        </p>
        {#if !resources || resources.length === 0}
          <em>[Provide a list of resources for the tool]</em>
        {:else}
          {#each other as opt}
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

  <!-- Related Cal-Adapt tools -->
  <div class="bx--row">
    <div class="bx--col-lg-12">
      <h2>Related Cal-Adapt Tools</h2>
      <slot name="tools">
        {#if !resources || tools.length === 0}
          <em>[Provide a list of related Cal-Adapt tools]</em>
        {:else}
          {#each tools as opt}
            <div class="bx--row">
              <div class="bx--col">
                <ClickableTile href="{opt.link}" class="center-row">
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
</div>
