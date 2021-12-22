<script>
  export let title = undefined;
  export let style = undefined;
  export let dimension = 60;

  let id = "icon-title-moon";
  $: attributes = {
    id,
    width: dimension,
    height: dimension,
    role: "img",
    "aria-labelledby": id,
    ...(style && { style }),
  };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  viewBox="0 0 32 32"
  {...attributes}
>
  <title id="{id}">{title ? title : "Icon"}</title>
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
