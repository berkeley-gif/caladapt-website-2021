<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { spring } from "svelte/motion";
  import { scaleLinear } from "d3-scale";
  import { select } from "d3-selection";
  import { pannable } from "../../../actions/pannable";

  // Props
  //------
  export let width = 500;
  export let intervals = [1, 2];
  export let margin = { top: 10, right: 20, bottom: 5, left: 20 };
  export let labelFn = (sel, d) => {
    sel.text(d);
  };
  // Function for autoplaying slider
  export function next() {
    if (value >= max) {
      value = intervals[0];
    } else {
      value = value + step;
    }
    coords.update(() => {
      return {
        x: xScale(value),
        y: 0,
      };
    });
    dispatch("change", value);
  }

  // Local variables
  //-----------------
  const dispatch = createEventDispatcher();
  let coords = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.1,
      damping: 0.35,
    }
  );

  // Reactive functionality
  //------------------------
  $: value = intervals[0];
  $: min = intervals[0];
  $: max = intervals[intervals.length - 1];
  $: step = intervals[1] - intervals[0];
  $: trackWidth = width - margin.left - margin.right;
  $: xScale = scaleLinear().domain([min, max]).range([0, trackWidth]);
  $: tickPositions = intervals.map((d) => ({
    id: `${d}-${d + step}`,
    xPos: xScale(d),
  }));

  // Helper Functions
  //--------------------
  function makeLabel(node, d) {
    const selection = select(node);
    labelFn(selection, d, step);
  }

  function getClosest(arr, goal) {
    return arr.reduce((prev, curr) =>
      Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
    );
  }

  function handlePanMove(event) {
    coords.update(($coords) => ({
      x: $coords.x + event.detail.dx,
      y: 0,
    }));
  }

  function handlePanEnd() {
    const x = getClosest(
      tickPositions.map((d) => d.xPos),
      $coords.x
    );
    $coords.x = x;
    value = Math.round(xScale.invert(x));
    dispatch("change", value);
  }

  // Lifecycle Functions
  //--------------------
  onMount(() => {
    dispatch("change", value);
  });
</script>

<style>
  svg {
    width: 100%;
    height: 50px;
  }

  .range-slider {
    width: 100%;
  }

  .range-slider-track {
    stroke: var(--gray-60);
    stroke-width: 1;
    stroke-linecap: "square";
  }

  .range-slider-progress {
    stroke: var(--teal-30);
    stroke-width: 3;
    stroke-linecap: "square";
  }

  .range-slider-thumb {
    cursor: pointer;
  }

  .range-slider-thumb circle {
    fill: var(--teal-60);
  }

  .range-slider-thumb line {
    stroke: var(--teal-60);
    stroke-width: 2;
    stroke-linecap: "round";
  }

  .tick line {
    stroke: var(--gray-60);
  }

  .tick text {
    fill: var(--gray-80);
    text-anchor: middle;
    font-size: 0.6875rem;
  }
</style>

<div class="range-slider" bind:clientWidth="{width}">
  <svg>
    <g transform="{`translate(${margin.left}, ${margin.top})`}">
      <g class="range-slider-ticks">
        {#each tickPositions as tickPos, i (tickPos.id)}
          <g class="tick" transform="{`translate(${tickPos.xPos}, 0)`}">
            <line y2="11"></line>
            <text y="25" use:makeLabel="{intervals[i]}"></text>
          </g>
        {/each}
      </g>
      <g class="range-slider-track">
        <line x1="0" y1="0" x2="{trackWidth}" y2="0"></line>
      </g>
      <g class="range-slider-progress">
        <line x1="0" y1="0" x2="{$coords.x}" y2="0"></line>
      </g>
      <g
        class="range-slider-thumb"
        transform="translate({$coords.x},{$coords.y})"
        role="slider"
        tabindex="0"
        aria-valuemax="{max}"
        aria-valuemin="{min}"
        aria-valuenow="{value}"
        use:pannable
        on:panmove="{handlePanMove}"
        on:panend="{handlePanEnd}"
      >
        <line y2="11"></line>
        <circle cx="0" cy="0" r="7"></circle>
      </g>
    </g>
  </svg>
</div>
