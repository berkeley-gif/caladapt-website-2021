<script>
  import { scaleOrdinal } from "d3-scale";

  export let title = "Legend";
  export let subtitle = "";
  export let width = "";
  export let height = "";
  export let rectWidth = "";
  export let rectHeight = "";
  export let padding = "";
  export let ramp = [];
  export let values = [];
  export let columns = 0;

  $: color = scaleOrdinal().domain(values).range(ramp);
</script>

<style>
  .legend--container {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    width: var(--width, auto);
    height: var(--height, auto);
    padding: var(--padding, 0.5rem);
    background-color: var(--white, #fff);
    border: 0.0625rem solid var(--gray-40);
    box-sizing: content-box;
  }

  .legend--columns {
    column-count: var(--columns);
    column-width: auto;
  }

  p {
    font-size: 0.875rem;
    fill: var(--gray-80, #333);
    margin: 0;
  }

  ul {
    margin: 0.5rem 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  li p {
    display: inline-block;
  }

  span {
    width: var(--rectWidth, 2rem);
    height: var(--rectHeight, 1rem);
    display: inline-block;
    border: 0.0625rem solid var(--gray-40);
  }

  .legend--title-text {
    font-weight: 600;
  }

  .legend--subtitle-text {
    font-weight: 400;
  }
</style>

<div
  class="legend legend--container"
  style="--width:{width};
    --height:{height};
    --padding:{padding};
    --rectWidth:{rectWidth};
    --rectHeight:{rectHeight};
    --columns:{columns};"
>
  <p class="legend--title-text">{title}</p>
  {#if subtitle}
    <p class="legend--subtitle-text">{subtitle}</p>
  {/if}
  <ul class="{columns ? 'legend--columns' : ''}">
    {#each values as v, i (`${v}`)}
      <li>
        <span style="background-color:{color(v)}"></span>
        <p>
          {v}
        </p>
      </li>
    {/each}
  </ul>
</div>
