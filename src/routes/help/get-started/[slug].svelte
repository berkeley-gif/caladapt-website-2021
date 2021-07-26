<svelte:head>
  <title>Getting Started – topic</title>
</svelte:head>

<h1>Getting Started Topic Page</h1>

<div class="page-grid page-grid--help">
  <aside class="sidebar-left">
    <SidebarLeft toc="{toc}" />
  </aside>
</div>

<script>
  import SidebarLeft from "../_SidebarLeft.svelte";

  let toc = [];
</script>
