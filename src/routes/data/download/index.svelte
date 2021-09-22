<script>
  import { InlineNotification } from "carbon-components-svelte";
</script>

<svelte:head>
  <title>Data Download | Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<div class="bleed banner overlay bg-gray-80">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-8 bx--col-md-8 bx--col-sm-4">
        <h1>Data Download Tool</h1>
        <p class="lead"></p>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>
  </div>
</div>

<div class="spacing--v-32"></div>

<!-- Upcoming events title -->
<div class="bx--grid">
  <div class="bx--row">
    <!-- 2 lg column spacer -->
    <div class="bx--col-lg-2"></div>

    <!-- middle content column -->
    <div class="bx--col-lg-8 bx--col-md-8 bx--col-sm-4">
      <InlineNotification
        hideCloseButton
        lowContrast
        kind="warning-alt"
        title="Under Construction"
        subtitle=""
      />
    </div>
    <!-- end middle lg column -->
  </div>
</div>
<!-- end bx--grid -->

<div class="spacing--v-96"></div>
