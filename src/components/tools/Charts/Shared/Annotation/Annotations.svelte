<script>
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
  <Connectors width="{$width}" height="{$height}" annotations="{annotations}" />
</Svg>
