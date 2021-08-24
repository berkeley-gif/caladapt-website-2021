<script>
  import { onMount, onDestroy } from "svelte";
  import NavBreadcrumb from "../../partials/NavBreadcrumb.svelte";

  export let activeCategory;
  export let breakpoint = 1000;
  export let items;

  let mediaQuery;
  $: showBreadcrumbs = true;

  const handleResize = () => {
    if (mediaQuery) {
      showBreadcrumbs = mediaQuery.matches;
    }
  };

  onMount(() => {
    mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    showBreadcrumbs = mediaQuery.matches;

    window.addEventListener("resize", handleResize);
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
    }
  });
</script>

{#if activeCategory && showBreadcrumbs}
  <div class="nav" style="padding:1rem 0 0;">
    <div class="bx--grid bx--grid--condensed">
      <div class="bx--row">
        <div class="bx--col">
          <NavBreadcrumb items="{items}" />
        </div>
      </div>
    </div>
  </div>
{/if}
