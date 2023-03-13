<script>
  export let titleText = "Alert Title";
  export let linkUrl = "/";
  export let linkTitle = "Link Title";

  import { InlineNotification } from "carbon-components-svelte";
</script>

<style lang="scss">
  @import "scss/site/mixins/media-queries";

  .alert-with-link :global(.bx--inline-notification) {
    margin: 0;
    max-width: 100%;
    background: $teal-10;

    &::before {
      border: none;
    }
  }

  .alert-with-link :global(.bx--inline-notification__text-wrapper) {
    flex-direction: column;
  }

  .bx--inline-notification__subtitle {
    margin-bottom: 0;
  }
</style>

<div class="alert-with-link">
  <InlineNotification
    lowContrast
    hideCloseButton
    kind="info"
    title="{titleText}"
  >
    <p class="bx--inline-notification__subtitle">
      Visit the <a href="{linkUrl}">{linkTitle}</a>
    </p>
  </InlineNotification>
</div>
