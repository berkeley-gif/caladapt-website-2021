<script>
  import { onMount } from "svelte";
  export let path;
  export let title;

  $: src = `https://v2.cal-adapt.org/${path}_iframe`;

  let v2_frame;

  onMount(() => {
    window.addEventListener("message", (e) => {
      // use message data that was passed from iframe page to set height
      if (
        e.data &&
        typeof e.data.height === "number" &&
        !isNaN(e.data.height)
      ) {
        v2_frame.style.height = `${e.data.height + 25}px`;
      } else {
        console.warn("Embed did not receive postMessage height value");
      }
    });
  });
</script>

<style>
  iframe {
    width: 100%;
    height: 100vh;
    display: block;
    margin: 0 auto;
    overflow: hidden;
  }
</style>

<iframe
  src="{src}"
  title="{title}"
  frameborder="0"
  allow="fullscreen"
  bind:this="{v2_frame}"></iframe>
