<style lang="scss">
  .header {
    color: #02484a;
    .lead {
      margin-top: 0;
    }
  }

  .topic-content {
    margin: 0 1rem;
  }
</style>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="page-grid page-grid--help">
  <aside class="sidebar-left">
    <SidebarLeft toc="{toc}" />
  </aside>

  <nav class="nav" style="padding:1rem 0 0;">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row">
        <div class="bx--col">
          <NavBreadcrumb items="{breadcrumbItems}" />
        </div>
      </div>
    </div>
  </nav>

  <div class="header">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row bg-teal-20" style="margin:0.5rem 0;">
        <div class="bx--col-lg-12">
          <h1>{title}</h1>
          <p class="lead">
            {topic.text}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="content">
    <div class="bx--grid topic-content">
      {@html html}
    </div>
  </div>
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
  import NavBreadcrumb from "~/partials/NavBreadcrumb.svelte";

  export let toc = [];
  export let html = "";
  export let topic = "";
  export let topics = [];

  const breadcrumbItems = [
    { href: "/", text: "Home" },
    { href: "/help/", text: "Help" },
    { href: "/help/get-started", text: "Get Started" },
    { href: `/help/get-started/${topic.slug}`, text: topic.title },
  ];

  let category;
  let activeCategory;
  let items = [];
  let title = "";

  $: title = topic.title;
</script>
