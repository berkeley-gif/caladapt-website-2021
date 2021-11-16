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

  // list of absolutely positioned label divs
  $: labelEls = container
    ? Array.from(
        container
          .closest(".layercake-container")
          .querySelectorAll(".annotation-label")
      )
    : [];

  // creates a path for each connector using:
  // source & target coordiantes for arrows
  // target coordinates only for thresholds
  $: setPath = (anno, i, connector) => {
    if (!Array.isArray(labelEls) || !labelEls.length) return;

    const { type } = connector;

    if (type === "threshold") {
      // Default to vertical orientation for threshold
      const orientation =
        typeof connector.orientation === "undefined"
          ? "v"
          : connector.orientation;
      // Default to full height of the chart for threshold
      const extent = orientation === "v" ? height : width;
      // Source coordinates are derived from data object in corresponding label
      const { data } = anno.label;
      if (!data) return;
      const sourceCoords = [
        parseCssValue(xGet(data), 0, width, height),
        parseCssValue(yGet(data), 1, width, height),
      ];
      return threshold()
        .orientation(orientation)
        .extent(extent)
        .x((q) => q[0])
        .y((q) => q[1])([sourceCoords]);
    } else {
      // Use position of label div to draw arrows
      const el = labelEls[i];

      // Get bounding box for element
      const elSource = getElPosition(el);

      // Parse attachment directives to know where to start the arrowhead
      const { anchor } = connector.source;
      const sourceCoords = anchor.split("-").map((q, j) => {
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

      // Parse where to draw to, i.e. target coordinates
      let targetCoords;
      if (connector.target) {
        const { x, y, data } = connector.target;
        if (x && y) {
          // if target position is in pixel values (in number or %)
          targetCoords = [
            parseCssValue(x, 0, width, height),
            parseCssValue(y, 1, width, height),
          ];
        } else if (data) {
          // if target position is specified as a data value
          targetCoords = [
            parseCssValue(xGet(data), 0, width, height),
            parseCssValue(yGet(data), 1, width, height),
          ];
        } else {
          // default target coordinates
          targetCoords = [100, 100];
        }
      }

      // Default to clockwise for swoopy arrows
      const clockwise =
        typeof connector.clockwise === "undefined" ? true : connector.clockwise;

      if (connector.type === "swoopy-arrow") {
        return swoopyArrow()
          .angle(Math.PI / 2)
          .clockwise(clockwise)
          .x((q) => q[0])
          .y((q) => q[1])([sourceCoords, targetCoords]);
      } else if (connector.type === "straight-arrow") {
        return straightArrow()
          .x((q) => q[0])
          .y((q) => q[1])([sourceCoords, targetCoords]);
      }
    }
  };

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
              style="{setStyle(connector.style)}"
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
