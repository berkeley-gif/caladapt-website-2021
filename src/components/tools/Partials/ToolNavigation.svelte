<script>
  import PageNav from "~/partials/PageNav.svelte";

  export let href;
  export let selectedItem;
  export let pageNavItems = [
    { id: "explore", label: "Explore Data" },
    { id: "about", label: "About the Tool" },
    { id: "resources", label: "Resources" },
    { id: "help", label: "Help" },
  ];
</script>

<style>
  .is-sticky {
    top: -1px;
    z-index: 1;
  }
</style>

<div class="bx--grid is-sticky">
  <div class="bx--row">
    <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
      <PageNav
        href="{href}"
        items="{pageNavItems}"
        selected="{selectedItem}"
        center="{false}"
        isSticky="{false}"
        zIndex="{'initial'}"
      />
    </div>
  </div>
</div>
