<script>
  // Connectors are arrows or thresholds placed within a new svg element
  // Based on annotated column example from LayerCake
  // https://layercake.graphics/example/Column
  import {
    swoopyArrow,
    straightArrow,
    threshold,
    getElPosition,
    parseCssValue,
    getPositionFromData,
  } from "./annotationUtils.js";

  export let annotations;
  export let height;
  export let width;
  export let xGet;
  export let yGet;

  let container;
  let labelEls;

  // Some lookups to convert between x, y / width, height terminology
  // and CSS names
  const lookups = [
    { dimension: "width", css: "left", position: "x" },
    { dimension: "height", css: "top", position: "y" },
  ];

  // List of absolutely positioned label divs
  $: labelEls = container
    ? Array.from(
        container
          .closest(".layercake-container")
          .querySelectorAll(".annotation-label")
      )
    : [];

  // Creates a svg path for each connector
  $: setPath = (anno, i, connector) => {
    if (!Array.isArray(labelEls) || !labelEls.length) return;

    const { type } = connector;

    if (!type) {
      console.warn("cannot create connector, missing type prop");
      return;
    }

    let sourceCoords = [0, 0];
    let targetCoords = [0, 0];

    if (type === "threshold") {
      // Default to vertical orientation for threshold
      const orientation =
        typeof connector.orientation === "undefined"
          ? "v"
          : connector.orientation;

      // Default to full height of the chart for threshold
      const extent = orientation === "v" ? height : width;

      // Parse where to place the threshold line
      const { data, dx, dy } = connector.source;
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
        // default target coordinates
        console.warn("unable to calculate source coordinates for connector");
      }

      // Create svg path for threshold
      return threshold()
        .orientation(orientation)
        .extent(extent)
        .x((q) => q[0])
        .y((q) => q[1])([sourceCoords]);
    } else {
      // Use label div
      const el = labelEls[i];

      // Get bounding box for label div element to draw arrows
      const elSource = getElPosition(el);

      // Parse where to start the arrowhead
      const {
        anchor,
        data: sourceData,
        dx: sourceDx,
        dy: sourceDy,
      } = connector.source;
      if (anchor) {
        sourceCoords = anchor.split("-").map((q, j) => {
          const point =
            q === "middle"
              ? elSource[lookups[j].css] + elSource[lookups[j].dimension] / 2
              : elSource[q];
          // Use source dx and dy to adjust coordinates
          return (
            point +
            parseCssValue(
              connector.source[`d${lookups[j].position}`],
              i,
              elSource.width,
              elSource.height
            )
          );
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
        console.warn("unable to calculate source coordinates for connector");
      }

      // Parse where to end arrowhead
      if (connector.target) {
        const {
          data: targetData,
          dx: targetDx,
          dy: targetDy,
        } = connector.target;
        if (targetData) {
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
          console.warn("unable to calculate target coordinates for connector");
        }
      }

      // Create svg path for arrow
      if (type === "swoopy-arrow") {
        return swoopyArrow()
          .angle(Math.PI / 2)
          .clockwise(
            connector.clockwise === "undefined" ? true : connector.clockwise
          )
          .x((q) => q[0])
          .y((q) => q[1])([sourceCoords, targetCoords]);
      } else if (connector.type === "straight-arrow") {
        return straightArrow()
          .x((q) => q[0])
          .y((q) => q[1])([sourceCoords, targetCoords]);
      }
    }
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
            <path
              style="{connector.style ? setStyle(connector.style) : ''}"
              marker-end="{connector.type === 'threshold'
                ? ''
                : 'url(#arrowhead)'}"
              d="{setPath(anno, i, connector)}"></path>
          {/each}
        </g>
      {/if}
    {/each}
  {/if}
</g>
