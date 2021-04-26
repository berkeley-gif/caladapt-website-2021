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
      <h3>Cal-Adapt Tools</h3>
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
              <h3>
                {opt.title}
              </h3>
              <p>
                {opt.desc}
              </p>
            </ClickableTile>
          </div>
        {/each}
      </div>
    </div>
    <div class="bx--col-lg-4 bg-teal-10">
      <h6>Blog</h6>
      <div style="margin-top:1rem;padding:0 1rem;">
        <ul>
          <li>
            <a href="http://localhost:3000/blog/extreme-heat-tool-updates/">
              Explore warm nights and heat waves with the Extreme Heat Tool on Cal-Adapt
            </a>
          </li>
        </ul>
      </div>
      <h6 style="margin-top: 2rem;">Help</h6>
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