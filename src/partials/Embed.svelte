<script>
  import { onMount } from "svelte";
  export let path;
  export let title;

  $: src = `https://v2.cal-adapt.org/${path}_iframe`;

  let frameHeight;

  onMount(() => {
    window.addEventListener("message", (e) => {
      // use message data that was passed from iframe page to set height
      if (
        e.data &&
        typeof e.data.height === "number" &&
        !isNaN(e.data.height)
      ) {
        frameHeight =
          frameHeight !== e.data.height ? e.data.height + 100 : frameHeight;
      } else {
        console.warn("Embed did not receive postMessage height value");
      }
    });
  });
</script>

<style>
  iframe {
    width: 100%;
    height: var(--iframe-height, 100vh);
    display: block;
    margin: 0 auto;
    overflow: hidden;
  }
</style>

<div style="--iframe-height:{frameHeight}px">
  <iframe src="{src}" title="{title}" frameborder="0" allow="fullscreen"
  ></iframe>
</div>
