<script>
  import Nav from "../partials/Nav.svelte";
  import Footer from "../partials/Footer.svelte";
  import BackToTop from "../partials/BackToTop.svelte";
  import SiteAlert from "../partials/SiteAlert.svelte";
  export let segment;
</script>

<svelte:head>
  <style src="../scss/main.scss"></style>
</svelte:head>

<div id="skip-to-content">
  <a href="#main-content">Skip to Main Content</a>
</div>

<SiteAlert />

<Nav segment="{segment}" />

<main id="main-content">
  <slot />
</main>

<BackToTop />

<Footer />
