<script>
  import { Nav, Footer, BackToTop, SiteAlert } from "~/partials";
  export let segment;
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
