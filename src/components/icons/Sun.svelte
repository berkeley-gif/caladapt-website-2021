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
  <title id="iconTitle">Sun Icon</title>
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
