<script>
  export let gridGap = 1;
</script>

<style>
  ul {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>

<ul style="grid-gap:{gridGap}rem">
  <slot />
</ul>
