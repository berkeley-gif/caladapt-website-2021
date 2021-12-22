<script>
  export let title = undefined;
  export let style = undefined;
  export let dimension = 60;

  let id = "icon-title-app";
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
  <path
    fill="#fff"
    d="M8,4V8H4V4Zm2-2H2v8h8Zm8,2V8H14V4Zm2-2H12v8h8Zm8,2V8H24V4Zm2-2H22v8h8ZM8,14v4H4V14Zm2-2H2v8h8Zm8,2v4H14V14Zm2-2H12v8h8Zm8,2v4H24V14Zm2-2H22v8h8ZM8,24v4H4V24Zm2-2H2v8h8Zm8,2v4H14V24Zm2-2H12v8h8Zm8,2v4H24V24Zm2-2H22v8h8Z"
  ></path>
</svg>
