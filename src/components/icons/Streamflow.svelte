<script>
  export let title = undefined;
  export let style = undefined;
  export let dimension = 60;

  let name = "streamflow";

  $: attributes = {
    width: dimension,
    height: dimension,
    role: title ? "img" : "presentation",
    ...(!title && { "aria-hidden": true }),
    ...(title && { "aria-labelledby": `icon-title-${name}` }),
    ...(style && { style }),
  };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  viewBox="0 0 62 62"
  {...attributes}
>
  {#if title}
    <title id="{`icon-title-${name}`}">{title}</title>
  {/if}
  <defs id="defs4">
    <linearGradient
      gradientTransform="matrix(1.2,0,0,1.2,-6.2,-6.2)"
      gradientUnits="userSpaceOnUse"
      y2="6"
      x2="56"
      y1="6"
      x1="6"
      id="gradient-streamflow"
    >
      <stop offset="0" style="stop-color:#DDFFFF" id="stop5"></stop>
      <stop offset="0.3933" style="stop-color:#FFFFFF" id="stop7"></stop>
      <stop offset="0.4886" style="stop-color:#F9FFFF" id="stop9"></stop>
      <stop offset="0.6178" style="stop-color:#E8FFFF" id="stop11"></stop>
      <stop offset="0.7664" style="stop-color:#CBFFFF" id="stop13"></stop>
      <stop offset="0.9282" style="stop-color:#A4FFFF" id="stop15"></stop>
      <stop offset="1" style="stop-color:#90FFFF" id="stop17"></stop>
    </linearGradient>
  </defs>
  <circle
    style="fill:url(#gradient-streamflow);stroke:none;stroke-opacity:1"
    id="circle14"
    cx="31"
    cy="31"
    r="30"></circle>
  <path
    id="path16"
    d="m 35.90266,6.64912 c 0,0 7.997657,0.5383159 7.985951,2.3070694 -0.01171,1.5529296 -9.470294,3.1108206 -9.470294,5.4178896 0,2.30955 19.694465,3.735964 19.694465,7.323084 0,3.507737 -19.345621,3.443237 -19.289431,8.337697 0.06087,5.574176 11.071698,8.149162 11.242608,17.045021 0.142815,7.52154 -12.887219,13.754337 -12.887219,13.754337 -5.906926,0.01584 -11.578447,-0.993333 -16.632869,-3.849231 -3.940104,-2.509176 -7.7513665,-4.935968 -10.3167086,-9.272308 0,0 12.2924596,-2.516206 12.5757496,-6.629244 0.28563,-4.113033 -3.130518,-5.588512 -3.132859,-11.361146 0,-6.635924 23.2906,-6.923687 23.196951,-9.029818 C 38.773014,18.583859 25.683171,18.501996 25.92666,14.212832 26.142053,10.335469 39.461336,10.742307 39.437924,9.0554176 39.421534,7.6463688 35.90266,6.64912 35.90266,6.64912 Z"
    style="fill:#2aa3e3"></path>
</svg>
