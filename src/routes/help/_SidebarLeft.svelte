<script>
  import {
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
  } from "carbon-components-svelte";
  import { stores } from "@sapper/app";

  export let toc;
  export let subToc = [];

  const { page } = stores();

  $: category = $page.params.category;
  $: slug = $page.params.slug;
</script>

<nav class="is-sticky sidebar-left--help" aria-label="Help Topics">
  <SideNavItems>
    {#each toc as opt}
      {#if opt.slug === category && Array.isArray(subToc) && subToc.length}
        <SideNavMenu text="{opt.title}" class="sidebar-left--sub-toc" expanded>
          {#each subToc as item}
            <SideNavMenuItem
              href="{`help/${opt.dir}/${item.slug}/`}"
              text="{item.title}"
              isSelected="{item.slug === slug}"
            />
          {/each}
        </SideNavMenu>
      {:else}
        <SideNavLink
          href="{`help/${opt.slug}/`}"
          text="{opt.title}"
          isSelected="{opt.slug === category}"
        />
      {/if}
    {/each}
  </SideNavItems>
</nav>
