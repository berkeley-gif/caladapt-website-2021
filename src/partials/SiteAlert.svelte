<script>
  import { InlineNotification } from "carbon-components-svelte";
</script>

<style>
  .alert :global(.bx--inline-notification) {
    margin: 0;
    max-width: 100%;
  }
  p {
    margin: 0;
  }
</style>

<div class="alert">
  <InlineNotification
    lowContrast
    hideCloseButton
    kind="info"
    title="This is a preview of Cal-Adapt's new tools which may not be feature complete."
  >
    <p class="bx--inline-notification__subtitle">
      Return to <a class="bx--link" href="https://cal-adapt.org"
        >Cal-Adapt.org</a
      > to access all completed climate tools and data.
    </p>
  </InlineNotification>
</div>
