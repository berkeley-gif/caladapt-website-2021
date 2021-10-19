<script>
  import { onMount } from "svelte";
  export let path;
  export let title;

  $: src = `https://v2.cal-adapt.org/${path}_iframe`;

  let v2_frame;

  onMount(() => {
    window.addEventListener("message", (e) => {
      window.alert("Here");
      // use message data that was passed from iframe page to set height
      if (e.data.height && typeof e.data.height === "number") {
        v2_frame.style.height = `${e.data.height + 300}px`;
      } else {
        console.warn("postMessage height data from iframe not received!");
      }
      // use message data that was passed from iframe page to set width
      if (e.data.width && typeof e.data.width === "number") {
        v2_frame.style.width = `${e.data.width}px`;
      } else {
        console.warn("postMessage width data from iframe not received!");
      }
    });
  });
</script>

<style>
  iframe {
    width: 95vw;
    height: 100vw;
  }
</style>

<iframe
  src="{src}"
  title="{title}"
  frameborder="0"
  allow="fullscreen"
  bind:this="{v2_frame}"></iframe>
