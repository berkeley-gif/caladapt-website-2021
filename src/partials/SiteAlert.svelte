<script>
  import {
    InlineNotification,
    NotificationActionButton,
    Link,
  } from "carbon-components-svelte";
</script>

<style>
  .alert :global(.bx--inline-notification) {
    margin: 0;
    max-width: 100%;
  }
</style>

<div class="alert">
  <InlineNotification
    lowContrast
    hideCloseButton
    kind="info"
    title="This is a preview of the new Cal-Adapt website."
    subtitle="Return to cal-adapt.org to access all climate tools and data."
  >
    <div slot="actions">
      <NotificationActionButton>
        <Link href="https://cal-adapt.org/">cal-adapt.org</Link>
      </NotificationActionButton>
    </div>
  </InlineNotification>
</div>
