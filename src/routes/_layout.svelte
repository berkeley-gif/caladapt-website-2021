<script>
  import { stores } from "@sapper/app";

  // inert polyfill only needs to be imported once app wide
  // see: https://github.com/WICG/inert
  import "wicg-inert";

  import { Nav, Footer, BackToTop, SiteAlert } from "~/partials";
  import { hasWideLayout } from "~/helpers/layout";

  export let segment;

  const { page } = stores();
  $: useWideLayout = hasWideLayout(`${$page.path}`);
</script>

<svelte:head>
  <style src="../scss/main.scss"></style>

  {#if process.env.noRobots}
    <meta name="robots" content="none" />
  {/if}

  {#if process.env.loggingEnabled}
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-LPTXXNV75J");
    </script>
  {/if}
</svelte:head>

<div id="skip-to-content">
  <a href="#main-content">Skip to Main Content</a>
</div>

{#if process.env.showBetaBanner}
  <SiteAlert />
{/if}

<Nav segment="{segment}" useWideLayout="{useWideLayout}" />

<main id="main-content">
  <slot />
</main>

<BackToTop />

<Footer useWideLayout="{useWideLayout}" />
