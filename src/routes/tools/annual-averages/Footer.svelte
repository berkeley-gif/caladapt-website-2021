<script>
  import {
    ClickableTile
  } from 'carbon-components-svelte';

  import { resources } from './_helpers';
  
  $: internal = resources.filter(d => d.category === 'caladapt');
  $: external = resources.filter(d => d.category === 'other');
</script>

<div class="bx--grid">

  <div class="bx--row">
    <div class="bx--col">
      <h3>Other Cal-Adapt Tools</h3>
    </div>
  </div>
  <div class="bx--row">
    <div class="bx--col-lg-12">
      <div class="bx--row">
        {#each internal as opt}
          <div class="bx--col">
            <ClickableTile href={opt.link}>
              <div>
                {#each opt.icons as icon}
                  <img src="{icon}" alt="icon" class="icon" style="width:60px;">
                {/each}
              </div>
              <h4>
                {opt.title}
              </h4>
              <p>
                {opt.desc}
              </p>
            </ClickableTile>
          </div>
        {/each}
      </div>
    </div>
    <div class="bx--col-lg-4 bg-teal-10">
      <h5>Help</h5>
      <div style="margin-top:1rem;padding:0 1rem;">
        <ul>
          <li>
            <a href="/help/get-started/">Learn how to get started with using climate projections on Cal-Adapt</a>
          </li>
          <li>
            <a href="/help/faqs/">Frequently Asked Questions</a>
          </li>
          <li>
            <a href="/help/tutorials/">Tutorials & Webinars</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col">
      <h3>Related Resources</h3>
    </div>
  </div>
  <div class="bx--row">
    {#each external as opt}
      <div class="bx--col-lg-4" style="display:flex;align-items:center;justify-content:center;margin:1rem;">
        <img style="width:100%;" src="/img/{opt.image}" alt="scripps logo">
      </div>
      <div class="bx--col-lg-8">
        <a href={opt.link} target="_blank">
          <h5>{opt.title}</h5>
        </a>
        <p>{opt.desc}</p>
      </div>
    {/each}
  </div>
</div>