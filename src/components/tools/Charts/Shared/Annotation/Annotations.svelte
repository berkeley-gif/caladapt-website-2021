<script>
  // Annotation component based on annotated column example from LayerCake
  // https://layercake.graphics/example/Column
  import { getContext, afterUpdate, onMount } from "svelte";
  import { Svg, Html } from "layercake";
  import Labels from "./Labels.svelte";
  import Connectors from "./Connectors.svelte";

  export let annotations;
  const { width, height, xGet, yGet } = getContext("LayerCake");
</script>

<Html>
  <Labels xGet="{$xGet}" yGet="{$yGet}" annotations="{annotations}" />
</Html>
<Svg>
  <Connectors
    xGet="{$xGet}"
    yGet="{$yGet}"
    width="{$width}"
    height="{$height}"
    annotations="{annotations}"
  />
</Svg>
