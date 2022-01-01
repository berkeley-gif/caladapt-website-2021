<script>
  export let title = undefined;
  export let style = undefined;
  export let dimension = 60;

  let name = "sun";
  $: attributes = {
    id: `icon-${name}`,
    width: dimension,
    height: dimension,
    role: "img",
    "aria-labelledby": `icon-title-${name}`,
    ...(style && { style }),
  };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  viewBox="0 0 62 62"
  {...attributes}
>
  <title id="{`icon-title-${name}`}">{title ? title : `${name} icon`}</title>
  <defs>
    <radialGradient id="gradient-sun">
      <stop offset="0" style="stop-color:#FFFFFF"></stop>
      <stop offset="0.0002" style="stop-color:#FFFFFE"></stop>
      <stop offset="0.2066" style="stop-color:#FCFAC1"></stop>
      <stop offset="0.4025" style="stop-color:#F9F68D"></stop>
      <stop offset="0.5848" style="stop-color:#F8F265"></stop>
      <stop offset="0.7507" style="stop-color:#F6F049"></stop>
      <stop offset="0.8945" style="stop-color:#F5EF37"></stop>
      <stop offset="1" style="stop-color:#F5EE31"></stop>
    </radialGradient>
  </defs>
  <circle fill="#FFF197" cx="31" cy="31" r="30"></circle>
  <circle fill="url(#gradient-sun)" cx="31" cy="31" r="25"></circle>
  <circle fill="#FFFFFF" cx="31" cy="31" r="10.5"></circle>
  <circle fill="#F7921B" cx="31" cy="31" r="9"></circle>
  <circle fill="#FCB040" cx="31" cy="31" r="7.5"></circle>
</svg>
