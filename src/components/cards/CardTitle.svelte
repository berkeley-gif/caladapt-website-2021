<script>
  export let titleText = "Title Me";
  export let headingLevel = 2;
  export let linkPath = "#";
</script>

<style lang="scss">
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    font-size: 1.375rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  a {
    color: var(--gray-100);
    text-decoration: none;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }
  }
</style>

{#if headingLevel === 3}
  <h3><a href="{linkPath}">{titleText}</a></h3>
{:else if headingLevel === 4}
  <h4><a href="{linkPath}">{titleText}</a></h4>
{:else if headingLevel === 5}
  <h5><a href="{linkPath}">{titleText}</a></h5>
{:else if headingLevel === 6}
  <h6><a href="{linkPath}">{titleText}</a></h6>
{:else}
  <h2><a href="{linkPath}">{titleText}</a></h2>
{/if}
