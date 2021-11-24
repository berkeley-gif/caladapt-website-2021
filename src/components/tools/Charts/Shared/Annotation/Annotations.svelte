<script>
  // Annotation component based on annotated column example from LayerCake
  // https://layercake.graphics/example/Column
  import { getContext } from "svelte";
  import { Svg, Html } from "layercake";
  import Labels from "./Labels.svelte";
  import Connectors from "./Connectors.svelte";

  export let annotations;
  const { width, height, xGet, yGet, padding } = getContext("LayerCake");

  $: axisLength = $width - $padding.right;
</script>

<Svg>
  <Connectors
    xGet="{$xGet}"
    yGet="{$yGet}"
    width="{axisLength}"
    height="{$height}"
    annotations="{annotations}"
  />
</Svg>
<Html>
  <Labels xGet="{$xGet}" yGet="{$yGet}" annotations="{annotations}" />
</Html>
