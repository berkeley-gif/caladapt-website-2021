<script>
  export let path;
  export let title;

  $: src = `https://v2.cal-adapt.org/${path}_iframe`;
</script>

<style>
  .iframe {
    width: 100vw;
    height: 100vh;
  }
</style>

<iframe
  class="iframe"
  src="{src}"
  title="{title}"
  frameborder="0"
  allow="fullscreen"></iframe>
