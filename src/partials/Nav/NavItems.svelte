<script>
  export let navItems = [];
  export let segment;
  export let handleClick = () => {};
</script>

<style lang="scss">
  .bx--header__nav {
    float: right;

    &:before {
      background: transparent;
    }
  }

  .bx--header__menu-item {
    color: var(--white);
    font-size: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;

    &:hover {
      background-color: var(--blue-50);
    }
  }

  .bx--header__menu-item[aria-current="page"]::after {
    border-bottom: 3px solid var(--accent);
  }

  @media (max-width: 66rem) {
    .bx--header__nav {
      display: block;
      height: auto;
      width: auto;
      position: absolute;
      top: 3rem;
      right: 0;
      background: rgba(0, 0, 0, 0.8);
    }

    .bx--header__menu-bar {
      flex-direction: column;
      width: 6rem;

      li {
        max-width: 12ch;
      }
    }

    .bx--header__menu-item {
      padding: 0.5rem 0;
    }
  }
</style>

<nav aria-label="Main menu" class="bx--header__nav">
  <ul class="bx--header__menu-bar">
    {#each navItems as item, i}
      <li>
        <a
          sapper:prefetch
          href="{item.path}"
          class="bx--header__menu-item"
          aria-label="{item.label}"
          aria-current="{segment === item.label.toLowerCase()
            ? 'page'
            : undefined}"
          on:click="{handleClick}"
        >
          <span class="bx--text-truncate--end">{item.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>
