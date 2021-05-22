<script>
  import {
    SideNavItems,
    SideNavLink,
  } from 'carbon-components-svelte';

  export let selected;
  export let offset = 50;
  export let href = '/about/';
  export let center = true;
  export let items = [
    {
      id: 'section1',
      label: 'Section 1',
    },
    {
      id: 'section2',
      label: 'Section 2',
    },
  ];

  function scrollTo(e, id) {
    e.preventDefault();
    selected = id;
    const el = document.getElementById(selected);
    window.scrollTo({
      top: el.offsetTop - offset,
      behavior: 'smooth',
    });
  }
</script>

<style lang="scss">
  .page-nav {
    width: 100%;
    background: rgba(250, 251, 251, 1);
    border-bottom: 1px solid #dadee1;
    background: #dadee1;
    top: 0;
    z-index: 2;
  }

  .page-nav :global(.bx--side-nav__items) {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
  }

  .page-nav.center :global(.bx--side-nav__items) {
    justify-content: center;
  }

  .page-nav :global(.bx--side-nav__link-text) {
    font-size: 1rem;
    text-transform: uppercase;
  }

  .page-nav :global(.bx--side-nav__link[aria-current="page"]::before), 
  .page-nav :global(.bx--side-nav__link--current::before) {
    width: 100%;
    height: 2px;
    top: 93%;
  }

  @media (max-width: 1000px) {
    .page-nav :global(.bx--side-nav__items) {
      flex-direction: column;
    }
  }
</style>

<div class="page-nav shadow is-sticky" class:center={center}>
  <SideNavItems>
    {#each items as item}
      <SideNavLink
        isSelected={selected === item.id}
        href={`${href}#${item.id}`}
        text={item.label}
        on:click={(e) => scrollTo(e, item.id)}
      />
    {/each}
  </SideNavItems>
</div>