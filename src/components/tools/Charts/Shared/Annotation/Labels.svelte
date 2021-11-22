<script>
  // Labels are divs with text nodes placed in an Absolutely positioned parent div
  // Based on annotated column example from LayerCake
  // https://layercake.graphics/example/Column

  export let annotations;
  export let xGet;
  export let yGet;

  const vals = ["top", "right", "bottom", "left"];

  $: labels = annotations.map((d) => d.label);

  $: setPositionAndStyle = (label) => {
    const { position, data, style } = label;
    let inlineStyle = "";

    // Place an aboslutely positioned div using a position or data object
    if (position) {
      // position object has a pair of top/bottom, right/left props
      // values are in pixel values or percentages
      vals.forEach((val) => {
        if (position[val]) {
          inlineStyle += `${val}: ${position[val]};`;
        }
      });
    } else if (data) {
      // data object is a row from the data displayed in chart
      // use the accessor functions to derive position
      let xPos = xGet(data) ? xGet(data) : 0;
      let yPos = yGet(data) ? yGet(data) : 0;
      // offset x & y position if data object has optional props
      const { dx, dy } = data;
      if (dx) {
        xPos += dx;
      }
      if (dy) {
        yPos += dy;
      }
      inlineStyle = `top:${yPos}px;left:${xPos}px;`;
    } else {
      // default if both position & data objects are missing
      console.warn(
        "label does not have data or position props, it will be placed at 0,0"
      );
      inlineStyle = `top:0;left:0`;
    }

    // Apply custom styles for div
    if (style) {
      inlineStyle += Object.entries(style)
        .map(([key, value]) => `--${key}:${value}`)
        .join(";");
    }

    return inlineStyle;
  };
</script>

<style>
  .annotation-label {
    position: absolute;
    max-width: var(--max-width, 200px);
    color: var(--color, var(--gray-80));
    font-size: var(--font-size, 1rem);
    background: var(--background, rgba(255, 255, 255, 0.7));
    padding: var(--padding, 2px);
    text-align: var(--text-align, "left");
  }
</style>

<div class="layercake-annotations">
  {#if Array.isArray(labels) && labels.length}
    {#each labels as d, i}
      <div
        class="annotation-label"
        data-id="{i}"
        style="{setPositionAndStyle(d)}"
      >
        {d.text}
      </div>
    {/each}
  {/if}
</div>
