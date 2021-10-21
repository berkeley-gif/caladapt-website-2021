<script>
  import { onMount } from "svelte";
  export let path;
  export let title;

  $: src = `https://v2.cal-adapt.org/${path}_iframe`;

  let v2_frame;

  onMount(() => {
    window.addEventListener("message", (e) => {
      // use message data that was passed from iframe page to set height and width
      if (e.data.height && e.data.width) {
        if (
          typeof e.data.height === "number" &&
          typeof e.data.width === "number"
        ) {
          v2_frame.style.height = `${e.data.height + 100}px`;
          v2_frame.style.width = `${e.data.width}px`;
        } else {
          console.warn(
            "postMessage height and/or width data from iframe not a valid number!"
          );
        }
      } else {
        console.warn("postMessage data from iframe not received!");
      }
    });
  });
</script>

<style>
  iframe {
    width: 100vw;
    height: 100vw;
    display: block;
    margin: 0 auto;
  }
</style>

<iframe
  src="{src}"
  title="{title}"
  frameborder="0"
  allow="fullscreen"
  bind:this="{v2_frame}"></iframe>
