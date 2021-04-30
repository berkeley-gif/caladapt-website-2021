<script>
  import {
    ClickableTile
  } from 'carbon-components-svelte';
  import Help32 from 'carbon-icons-svelte/lib/Help32';
  import User32 from 'carbon-icons-svelte/lib/User32';
  import Video32 from 'carbon-icons-svelte/lib/Video32';
  import Blog32 from 'carbon-icons-svelte/lib/Blog32';

  export let resources;
  
  const helpIcons = {
    'get-started': User32,
    tutorials: Video32,
    faqs: Help32,
    blog: Blog32,
  };

  $: caladaptTools = resources.filter(d => d.category === 'caladapt');
  $: caladaptHelp = resources.filter(d => d.category === 'help');
  $: other = resources.filter(d => d.category === 'other');
</script>

<style>
  .help-tile :global(.bx--tile--clickable) {
    background-color: #cce4e4;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .help-tile :global(.bx--tile--clickable:hover) {
    background-color: rgba(204, 228, 228, 0.5);;
  }

  .icon-circle {
    flex: 0 0 4.1875rem;
  }

  .help-tile p {
    margin-bottom: 0;
    padding: 0.5rem;
  }
</style>

<div class="bx--grid">
  <!-- Other Cal-Adapt Tools -->
  <div class="bx--row">
    <div class="bx--col">
      <h4 class="title">Other Cal-Adapt Tools</h4>
    </div>
  </div>
  <div class="bx--row">
    {#each caladaptTools as opt}
      <div class="bx--col-lg-4">
        <ClickableTile href={opt.link} style={"height:100%;"}>
          <div>
            {#each opt.icons as icon}
              <img src="{icon}" alt="icon" class="icon" style="width:60px;">
            {/each}
          </div>
          <h4>{opt.title}</h4>
          <p>{opt.desc}</p>
        </ClickableTile>
      </div>
    {/each}
  </div>
  <!-- Cal-Adapt Help -->
  <div class="bx--row">
    <div class="bx--col">
      <h4 class="title">Cal-Adapt Help</h4>
    </div>
  </div>
  <div class="bx--row">
    {#each caladaptHelp as opt}
      <div class="bx--col help-tile">
        <ClickableTile href={opt.link}>
          <div class="icon-circle bg-teal-60 text-white">
            <svelte:component this={helpIcons[opt.icon]} /> 
          </div>
          <p>{opt.title}</p>
        </ClickableTile>
      </div>
    {/each}
  </div>
  <!-- Related Resources -->
  <div class="bx--row">
    <div class="bx--col">
      <h4 class="title">Related Resources</h4>
    </div>
  </div>
  {#each other as opt}
    <div class="bx--row" style="margin-bottom:1rem;">
      <div class="bx--col">
        <ClickableTile href={opt.link} class="center-row">
          <div class="center">
            <img style="width:300px;" src="/img/{opt.image}" alt="scripps logo">
          </div>
          <div style="padding:1rem 5rem 1rem 1rem;">
            <h4>{opt.title}</h4>
            <p>{opt.desc}</p>
          </div>
        </ClickableTile>
      </div>
    </div>
  {/each}
</div>