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
  viewBox="0 0 32 32"
  aria-labelledby="iconTitle"
  {...attributes}
>
  <title id="iconTitle">All Apps</title>
  <path
    fill="#fff"
    d="M8,4V8H4V4Zm2-2H2v8h8Zm8,2V8H14V4Zm2-2H12v8h8Zm8,2V8H24V4Zm2-2H22v8h8ZM8,14v4H4V14Zm2-2H2v8h8Zm8,2v4H14V14Zm2-2H12v8h8Zm8,2v4H24V14Zm2-2H22v8h8ZM8,24v4H4V24Zm2-2H2v8h8Zm8,2v4H14V24Zm2-2H12v8h8Zm8,2v4H24V24Zm2-2H22v8h8Z"
  ></path>
</svg>
