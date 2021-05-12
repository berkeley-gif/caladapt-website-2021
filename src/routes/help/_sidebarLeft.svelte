<script>
  import {
    SideNavItems,
    // SideNavMenu,
    // SideNavMenuItem,
    SideNavLink,
  } from 'carbon-components-svelte';
  import { stores } from '@sapper/app';

  export let toc;

  const { page } = stores();
  // let showItems;

  $: category = $page.params.category;
  $: slug = $page.params.slug;
</script>

<nav class="is-sticky">
  <SideNavItems>
    {#each toc as opt}
<!--       {#if opt.slug === 'get-started' && showItems}
        <SideNavMenu
         text={opt.title}
         expanded={category === 'get-started'}
         class={category === 'get-started' ? 'bx--side-nav__link--current': ''}>
          {#each gettingStartedToc as item}
            <SideNavMenuItem
              href={`help/get-started/${item.slug}/`}
              text={item.title}
              isSelected={item.slug === slug}
            />
          {/each}
        </SideNavMenu>
      {:else} -->
        <SideNavLink
          href={`help/${opt.slug}/`}
          text={opt.title}
          isSelected={opt.slug === category}
        />
<!--       {/if} -->
    {/each}
  </SideNavItems>
</nav>
