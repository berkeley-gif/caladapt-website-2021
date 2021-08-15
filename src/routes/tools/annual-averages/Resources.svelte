<script>
  import { ClickableTile } from "carbon-components-svelte";

  export let resources;

  $: tools = resources.filter((d) => d.category === "caladapt");
  $: other = resources.filter((d) => d.category === "external");
</script>

<!-- Resources -->
<div class="bx--row">
  <div class="bx--col">
    <h2>Resources</h2>
  </div>
</div>
{#each other as opt}
  <div class="bx--row">
    <div class="bx--col">
      <ClickableTile href="{opt.link}" class="center-row">
        <div class="center">
          <img style="width:300px;" src="/img/{opt.image}" alt="scripps logo" />
        </div>
        <div style="padding:1rem 5rem 1rem 1rem;">
          <h4>{opt.title}</h4>
          <p>{opt.desc}</p>
        </div>
      </ClickableTile>
    </div>
  </div>
{/each}

<!-- Related Cal-Adapt Tools -->
<div class="bx--row">
  <div class="bx--col">
    <h3>Related Cal-Adapt Tools</h3>
  </div>
</div>
<div class="bx--row">
  {#each tools as opt}
    <div class="bx--col-lg-4">
      <ClickableTile href="{opt.link}" style="{'height:100%;'}">
        <div>
          {#each opt.icons as icon}
            <img src="{icon}" alt="icon" class="icon" style="width:60px;" />
          {/each}
        </div>
        <h4>{opt.title}</h4>
        <p>{opt.desc}</p>
      </ClickableTile>
    </div>
  {/each}
</div>
