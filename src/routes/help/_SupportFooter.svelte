<script>
  export let address = "support@cal-adapt.org";
  export let borderTop = true;
</script>

<style lang="scss">
  p.feedback {
    text-align: left;
    float: none;
    margin: 0.5rem 1rem;
  }

  .rule {
    height: 1px;
    background-color: var(--gray-30);
    margin: 0 1rem;
  }
</style>

<div class="footer">
  {#if borderTop}
    <div class="rule"></div>
  {/if}
  <p class="feedback">
    Email <a href="mailto:{address}">{address}</a> with your feedback on this topic.
  </p>
</div>
