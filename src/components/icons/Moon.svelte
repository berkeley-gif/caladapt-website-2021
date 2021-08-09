<script>
  let className = undefined;
  export { className as class };
  export let id = undefined;
  export let tabindex = undefined;
  export let focusable = false;
  export let title = undefined;
  export let style = undefined;
  export let dimension = 60;

  $: ariaLabel = $$props["aria-label"];
  $: ariaLabelledBy = $$props["aria-labelledby"];
  $: labelled = ariaLabel || ariaLabelledBy || title;
  $: attributes = {
    width: dimension,
    height: dimension,
    role: labelled ? "img" : undefined,
    focusable: tabindex === "0" ? true : focusable,
    tabindex,
  };
</script>

<svg
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:keyup
  on:keydown
  xmlns="http://www.w3.org/2000/svg"
  class="{className}"
  preserveAspectRatio="xMidYMid meet"
  style="{style}"
  id="{id}"
  viewBox="0 0 62 62"
  aria-labelledby="iconTitle"
  {...attributes}
>
  <title id="iconTitle">Moon Icon</title>
  <defs>
    <radialGradient id="gradient-moon">
      <stop offset="0" style="stop-color:#CCE0F4"></stop>
      <stop offset="0.1457" style="stop-color:#A2D0EE"></stop>
      <stop offset="0.3651" style="stop-color:#69BBE6"></stop>
      <stop offset="0.5681" style="stop-color:#3BA9E0"></stop>
      <stop offset="0.748" style="stop-color:#1B9DDC"></stop>
      <stop offset="0.8981" style="stop-color:#0796D9"></stop>
      <stop offset="1" style="stop-color:#0093D8"></stop>
    </radialGradient>
  </defs>
  <circle fill="#00AEEF" cx="31" cy="31" r="30"></circle>
  <circle fill="url(#gradient-moon)" cx="31" cy="31" r="25"></circle>
  <circle fill="#FFFFFF" cx="31" cy="31" r="10.5"></circle>
  <circle fill="#F7921B" cx="31" cy="31" r="9"></circle>
  <circle fill="#FCB040" cx="31" cy="31" r="7.5"></circle>
</svg>
