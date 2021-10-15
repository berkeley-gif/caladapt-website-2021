<script>
  import { onMount } from "svelte";
  export let path;
  export let title;

  $: src = `https://v2.cal-adapt.org/${path}_iframe`;

  let v2_frame;

  onMount(() => {
    window.addEventListener("message", (e) => {
      // use message data that was passed from iframe page to set height
      if (typeof e.data.height !== "number")
        return console.warn("postMessage from iframe not received!");
      return (v2_frame.style.height = `${e.data.height}px`);
    });
  });
</script>

<style>
  iframe {
    width: 100vw;
    height: 100vw;
    overflow-y: hidden;
  }
</style>

<iframe
  src="{src}"
  title="{title}"
  frameborder="0"
  allow="fullscreen"
  bind:this="{v2_frame}"></iframe>
