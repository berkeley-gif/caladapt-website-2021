<script>
  import { onMount } from "svelte";
  import { Nav, Footer, BackToTop, SiteAlert } from "~/partials";
  export let segment;

  let scriptAdded = false;

  onMount(() => {
    // only add Google Analytics in production settings
    if (process.env.DEPLOY === "prod" && !scriptAdded) {
      const script = document.createElement("script");
      script.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "G-LPTXXNV75J");
      `;
      document.body.append(script);
      scriptAdded = true;
    }
  });
</script>

<svelte:head>
  <style src="../scss/main.scss"></style>
</svelte:head>

<div id="skip-to-content">
  <a href="#main-content">Skip to Main Content</a>
</div>

{#if process.env.showBetaBanner}
  <SiteAlert />
{/if}

<Nav segment="{segment}" />

<main id="main-content">
  <slot />
</main>

<BackToTop />

<Footer />
