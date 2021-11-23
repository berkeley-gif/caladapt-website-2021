<script>
  // Connectors are arrows or thresholds placed within a new svg element
  // Based on annotated column example from LayerCake
  // https://layercake.graphics/example/Column
  import {
    swoopyArrow,
    straightArrow,
    threshold,
    getPositionFromAnchor,
    getPositionFromData,
    getPositionFromXY,
  } from "./annotationUtils.js";

  export let annotations;
  export let height;
  export let width;
  export let xGet;
  export let yGet;

  let container;
  let labelEls;

  // List of absolutely positioned label divs
  $: labelEls = container
    ? Array.from(
        container
          .closest(".layercake-container")
          .querySelectorAll(".annotation-label")
      )
    : [];

  // Creates a svg path for each arrow connector
  $: setArrowPath = (anno, i, connector) => {
    if (!Array.isArray(labelEls) || !labelEls.length) return;

    // Get corresponding label div & bounding box
    const label = labelEls[i];

    const { type, source, target } = connector;

    // If no type or source is specified do not create connector
    if (!type || !source || !target) {
      console.warn(
        "cannot create arrow connector: missing required type or source or target prop"
      );
      return;
    }

    let sourceCoords;
    let targetCoords;

    // Get source coordinates (start of connector)
    const { anchor, data: sourceData, dx: sourceDx, dy: sourceDy } = source;

    if (anchor) {
      sourceCoords = getPositionFromAnchor({
        anchor,
        label,
        dx: sourceDx,
        dy: sourceDy,
      });
    } else if (sourceData) {
      sourceCoords = getPositionFromData({
        data: sourceData,
        xGet,
        yGet,
        width,
        height,
        dx: sourceDx,
        dy: sourceDy,
      });
    } else {
      console.warn(
        "cannot create connector: missing anchor or data props for source"
      );
      return;
    }

    // Get target coordinates (end of connector)
    const { x, y, data: targetData, dx: targetDx, dy: targetDy } = target;

    if (x && y) {
      targetCoords = getPositionFromXY({
        x,
        y,
        width,
        height,
        dx: targetDx,
        dy: targetDy,
      });
    } else if (targetData) {
      targetCoords = getPositionFromData({
        data: targetData,
        xGet,
        yGet,
        width,
        height,
        dx: targetDx,
        dy: targetDy,
      });
    } else {
      console.warn("cannot create connector: missing data prop for target");
      return;
    }

    // Default to clockwise direction for swoop
    const clockwise =
      connector.clockwise === "undefined" ? true : connector.clockwise;

    if (type === "swoopy-arrow") {
      return swoopyArrow()
        .angle(Math.PI / 2)
        .clockwise(clockwise)
        .x((q) => q[0])
        .y((q) => q[1])([sourceCoords, targetCoords]);
    } else {
      return straightArrow()
        .x((q) => q[0])
        .y((q) => q[1])([sourceCoords, targetCoords]);
    }
  };

  // Creates a svg path for each threshold connector
  $: setThresholdPath = (anno, i, connector) => {
    if (!Array.isArray(labelEls) || !labelEls.length) return;

    const { source } = connector;

    // If no source is specified do not create connector
    if (!source) {
      console.warn(
        "cannot create threshold connector: missing required source prop"
      );
      return;
    }

    let sourceCoords;

    // Get source coordinates (start of connector)
    const { data, dx, dy } = source;
    if (data) {
      sourceCoords = getPositionFromData({
        data,
        xGet,
        yGet,
        width,
        height,
        dx,
        dy,
      });
    } else {
      console.warn(
        "cannot create threshold connector: missing data prop for source"
      );
      return;
    }

    // Default to vertical orientation for threshold
    const orientation =
      typeof connector.orientation === "undefined"
        ? "v"
        : connector.orientation;

    // Default to full height of the chart for threshold
    const extent = orientation === "v" ? height : width;

    // Create svg path for threshold
    return threshold()
      .orientation(orientation)
      .extent(extent)
      .x((q) => q[0])
      .y((q) => q[1])([sourceCoords]);
  };

  // Override defult connector style
  $: setStyle = (styles) => {
    return Object.entries(styles)
      .map(([key, value]) => `--${key}:${value}`)
      .join(";");
  };
</script>

<style>
  .annotation-connector path {
    fill: var(--fill, none);
    stroke: var(--stroke, var(--gray-80));
    stroke-width: var(--stroke-width, 1.4);
    stroke-dasharray: var(--stroke-dasharray, 0);
  }

  marker {
    fill: var(--fill, var(--gray-80));
  }
</style>

<defs>
  <marker
    id="arrowhead"
    viewBox="-10 -10 20 20"
    markerWidth="17"
    markerHeight="17"
    orient="auto"
  >
    <path d="M-6,-6 L 0,0 L -6,6"></path>
  </marker>
</defs>

<g bind:this="{container}">
  {#if Array.isArray(labelEls) && labelEls.length}
    {#each annotations as anno, i}
      {#if anno.connectors}
        <g class="annotation-connector">
          {#each anno.connectors as connector}
            {#if connector.type === "threshold"}
              <path
                style="{connector.style ? setStyle(connector.style) : ''}"
                d="{setThresholdPath(anno, i, connector)}"></path>
            {:else}
              <path
                style="{connector.style ? setStyle(connector.style) : ''}"
                marker-end="{'url(#arrowhead)'}"
                d="{setArrowPath(anno, i, connector)}"></path>
            {/if}
          {/each}
        </g>
      {/if}
    {/each}
  {/if}
</g>
