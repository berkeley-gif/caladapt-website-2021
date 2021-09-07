<script>
  import LogoTwitter32 from "carbon-icons-svelte/lib/LogoTwitter32";

  export let text = "The latest from Cal-Adapt";
  export let url = "https://cal-adapt.org";
  export let hashtags = [];
  export let via = "cal_adapt";
  export let related = "";
  export let linkText = "Tweet this";

  $: query = [
    text && `text=${encodeURIComponent(text)}`,
    url && `url=${encodeURIComponent(url)}`,
    hashtags && `hashtags=${hashtags.join(",")}`,
    via && `via=${encodeURIComponent(via)}`,
    related && `related=${encodeURIComponent(related)}`,
  ]
    .filter(Boolean)
    .join("&");

  $: href = `https://twitter.com/intent/tweet?${query}`;

  function open(e) {
    e.preventDefault();

    const w = 600;
    const h = 400;
    const x = (screen.width - w) / 2;
    const y = (screen.height - h) / 2;
    const features = `width=${w},height=${h},left=${x},top=${y}`;

    window.open(href, "_blank", features);
  }
</script>

<style>
  a {
    display: flex;
    align-items: center;
    color: rgb(29, 161, 242);
    font-weight: bold;
  }
</style>

<div>
  <a target="_blank" noreferrer href="{href}" on:click="{open}"
    ><LogoTwitter32 /><span>{linkText}</span></a
  >
</div>
