<script>
  import { getContext } from "svelte";

  const { xGet, yGet, data } = getContext("LayerCake");

  $: path = (values) => {
    return (
      "M" +
      values
        .map((d) => {
          return $xGet(d) + "," + $yGet(d);
        })
        .join("L")
    );
  };
</script>

<path
  class="{`path-line forecast`}"
  d="{path($data)}"
  stroke="#9fa6ac"
  fill="none"
  stroke-width="1px"
>
</path>
<g>
  {#each $data as d}
    <text
      x="{$xGet(d)}"
      y="{$yGet(d)}"
      dx="-10"
      dy="-10"
      style="font-size:1.2rem;text-shadow: #FFF 1px 0 8px;"
    >
      {d.value} °F
    </text>
    <circle
      cx="{$xGet(d)}"
      cy="{$yGet(d)}"
      r="{4}"
      fill="#002448"
      fill-opacity="{0.8}"
      stroke="blue"
      stroke-width="{1}"></circle>
  {/each}
</g>
