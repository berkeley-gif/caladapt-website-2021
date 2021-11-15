<script>
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

  let container;
  let labelEls;
  /* --------------------------------------------
   * Some lookups to convert between x, y / width, height terminology
   * and CSS names
   */
  const lookups = [
    { dimension: "width", css: "left", position: "x" },
    { dimension: "height", css: "top", position: "y" },
  ];

  $: labelEls = container
    ? Array.from(
        container
          .closest(".layercake-container")
          .querySelectorAll(".annotation-label")
      )
    : [];

  $: setPath = (anno, i, connector) => {
    if (!Array.isArray(labelEls) || !labelEls.length) return;
    const el = labelEls[i];

    /* --------------------------------------------
     * Parse our attachment directives to know where to start the arrowhead
     * measuring a bounding box based on our annotation el
     */
    const elSource = getElPosition(el);

    const { anchor } = connector.source;
    const sourceCoords = anchor.split("-").map((q, j) => {
      const point =
        q === "middle"
          ? elSource[lookups[j].css] + elSource[lookups[j].dimension] / 2
          : elSource[q];
      // use source dx and dy to adjust coordinates
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

    /* --------------------------------------------
     * Default to clockwise for swoopy arrows
     */
    const clockwise =
      typeof connector.clockwise === "undefined" ? true : connector.clockwise;

    /* --------------------------------------------
     * Parse where we're drawing to
     */
    const { x, y } = connector.target;
    const targetCoords = [
      parseCssValue(x, 0, width, height),
      parseCssValue(y, 1, width, height),
    ];

    /* --------------------------------------------
     * Default to straight line without arrowhead
     */
    const connectorType =
      typeof connector.type === "undefined" ? "threshold" : connector.type;

    /* --------------------------------------------
     * Default to vertical line orientation
     */
    const orientation =
      typeof connector.orientation === "undefined"
        ? "v"
        : connector.orientation;
    const extent = orientation === "v" ? height : width;

    /* --------------------------------------------
     * Create path
     */
    if (connectorType === "swoopy-arrow") {
      return swoopyArrow()
        .angle(Math.PI / 2)
        .clockwise(clockwise)
        .x((q) => q[0])
        .y((q) => q[1])([sourceCoords, targetCoords]);
    } else if (connectorType === "straight-arrow") {
      return straightArrow()
        .x((q) => q[0])
        .y((q) => q[1])([sourceCoords, targetCoords]);
    } else {
      return threshold()
        .orientation(orientation)
        .extent(extent)
        .x((q) => q[0])
        .y((q) => q[1])([sourceCoords]);
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
