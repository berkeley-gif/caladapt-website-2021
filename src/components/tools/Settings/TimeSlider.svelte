<script>
  import { onMount, createEventDispatcher } from 'svelte';
	import { spring } from 'svelte/motion';
  import { scaleLinear } from 'd3-scale';
  import { range } from 'd3-array';
	import { select } from 'd3-selection';
  import { pannable } from '../../../actions/pannable';


  // Props
  //------
  export let start = 1;
  export let end = 11;
  export let step = 1;
  export let margin = { top: 10, right: 20, bottom: 5, left: 20 };
  export let labelFn = (sel, d) => {
    sel.text(d)
  };
	// Function for autoplaying slider
	export function next() {
    if (value >= max) {
      value = data[0];
    } else {
      value = value + step;
    }
    coords.update(() => {
			return {
				x: xScale(value),
				y: 0,
			}
		});
		dispatch('change', value);
  }


  // Local variables
  //-----------------
	const dispatch = createEventDispatcher();
  let width = 500;
  let coords  = spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.35,
  });


  // Reactive functionality
  //------------------------
  $: data = range(start, end, step);
	$: value = data[0];
  $: min = data[0];
  $: max = data[data.length-1];
	$: trackWidth = width - margin.left - margin.right;    
  $: xScale = scaleLinear()
      .domain([min, max])
      .range([0, trackWidth]);
  $: tickPositions = data.map(d => xScale(d));


  // Helper Functions
  //--------------------
  function makeLabel(node, d) {
		const selection = select(node);
		labelFn(selection, d);
  }

  function getClosest(arr, goal) {
    return arr
      .reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  }

  function handlePanMove(event) {
    coords.update($coords => ({
      x: $coords.x + event.detail.dx,
      y: 0
    }));
  }

  function handlePanEnd() {
    const x = getClosest(tickPositions, $coords.x);
    $coords.x = x;
    value = Math.round(xScale.invert(x));
		dispatch('change', value);
  }


  // Lifecycle Functions
  //--------------------
  onMount(() => {
		dispatch('change', value);
  });
</script>

<style>
  svg {
    width: 100%;
    height: 50px;
  }

  .range-slider-track {
    stroke: #dadee1;
    stroke-width: 1;
		stroke-linecap: "square";
  }

  .range-slider-progress {
    stroke: #68aeb0;
    stroke-width: 3;
		stroke-linecap: "square";
  }

  .range-slider-thumb {
    cursor: pointer;
  }

  .range-slider-thumb circle {
    fill: #04797c;
  }

  .range-slider-thumb line {
    stroke: #04797c;
    stroke-width: 2;
		stroke-linecap: "round";
  }

  .tick line {
    stroke: #dadee1;
  }

  .tick text {
    fill: #474440;
    text-anchor: middle;
    font-size: 0.7rem;
  }
</style>

<div 
  class="range-slider"
	bind:clientWidth={width}>
  <svg>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
			<g class="range-slider-ticks">
				{#each tickPositions as tickPos, i}
				<g class="tick" transform={`translate(${tickPos}, 0)`}>
					<line y2="11"></line>
					<text y="25" use:makeLabel={data[i]}></text>
				</g>
				{/each}
			</g>
      <g class="range-slider-track">
        <line x1="0" y1="0" x2={trackWidth} y2="0" />
      </g>
      <g class="range-slider-progress">
        <line x1="0" y1="0" x2={$coords.x} y2="0" />
      </g>
      <g class="range-slider-thumb"
        transform="translate({$coords.x},{$coords.y})"
				role="slider"
  			tabindex="0"
				aria-valuemax={max}
  			aria-valuemin={min}
  			aria-valuenow={value}
        use:pannable
        on:panmove={handlePanMove}
        on:panend={handlePanEnd}>
        <line y2="11"></line>
        <circle cx="0" cy="0" r="7"/>
      </g>
    </g>

  </svg>
</div>