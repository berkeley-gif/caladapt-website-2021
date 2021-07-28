<svelte:head>
  <title>Getting Started – topic</title>
</svelte:head>

<h1>Getting Started Topic Page</h1>

<div>{@html html}</div>

<div class="page-grid page-grid--help">
  <aside class="sidebar-left">
    <SidebarLeft toc="{toc}" />
  </aside>
</div>

<script context="module">
  export async function preload({ params: { slug } }) {
    try {
      const res = await this.fetch(`help/get-started/${slug}.json`);
      const json = await res.json();
      if (res.status === 200) return json;
    } catch (error) {
      this.error(res.status, json.message);
    }
  }
</script>

<script>
  import SidebarLeft from "../_SidebarLeft.svelte";

  export let toc = [];
  export let html = "";
</script>
