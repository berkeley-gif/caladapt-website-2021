<script>
  import Nav from '../components/partials/Nav.svelte';
  import Footer from '../components/partials/Footer.svelte';
  export let segment;
</script>

<svelte:head>
  <style src="../scss/main.scss"></style>
</svelte:head>

<Nav {segment}/>

<main>
  <slot></slot>
</main>

<Footer />