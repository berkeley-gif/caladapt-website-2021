<script>
  export let segment;

  let open = false;
</script>

<style lang="scss">
  .main-nav {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 70px;
    background-color: var(--gray-90);
    border-bottom: 1px solid var(--gray-60);

    .bx--header__nav {
      display: block;
    }

    .bx--header__menu-toggle {
      display: none;
      position: absolute;
      right: 0.5rem;
    }

    .bx--header__nav:before {
      background: transparent;
    }

    .bx--header__menu-item {
      color: var(--white);
      font-size: 1rem;

      &:hover {
        background-color: var(--blue-50);
      }
    }

    .bx--header__menu-item[aria-current="page"]::after {
      border-bottom: 3px solid var(--accent);
    }

    .logo {
      width: 100px;
    }

    @media (max-width: 1000px) {
      .bx--header__nav {
        display: none;

        &.expanded {
          display: block;
          margin-top: 140px;
          width: 100%;
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
        }
      }

      .bx--header__menu-toggle {
        display: flex;
      }
    }
  }
</style>

<header class="main-nav bx--header">
  <a
    sapper:prefetch
    class="bx--header__name"
    aria-current="{segment === undefined ? 'page' : undefined}"
    href="/"
  >
    <img src="img/logos/cal-adapt_logo.svg" class="logo" alt="Cal-Adapt logo" />
  </a>
  <button
    type="button"
    title="Open menu"
    on:click="{() => (open = !open)}"
    class="bx--header__action bx--header__menu-trigger bx--header__menu-toggle"
  >
    <svg
      data-carbon-icon="Menu20"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      width="20"
      height="20"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      focusable="false"
      ><path
        d="M2 14.8H18V16H2zM2 11.2H18V12.399999999999999H2zM2 7.6H18V8.799999999999999H2zM2 4H18V5.2H2z"
      ></path><title>Open Menu</title></svg
    >
  </button>
  <nav
    aria-label="Main menu"
    class="bx--header__nav"
    class:expanded="{open}"
    on:click="{() => (open = !open)}"
  >
    <ul class="bx--header__menu-bar">
      <li>
        <a
          sapper:prefetch
          href="/tools/"
          class="bx--header__menu-item"
          role="menuitem"
          tabindex="0"
          aria-current="{segment === 'tools' ? 'page' : undefined}"
        >
          <span class="bx--text-truncate--end">Tools</span>
        </a>
      </li>
      <li>
        <a
          sapper:prefetch
          href="/data/"
          class="bx--header__menu-item"
          role="menuitem"
          tabindex="0"
          aria-current="{segment === 'data' ? 'page' : undefined}"
        >
          <span class="bx--text-truncate--end">Data</span>
        </a>
      </li>
      <li>
        <a
          sapper:prefetch
          href="/help/"
          class="bx--header__menu-item"
          role="menuitem"
          tabindex="0"
          aria-current="{segment === 'help' ? 'page' : undefined}"
        >
          <span class="bx--text-truncate--end">Help</span>
        </a>
      </li>
      <li>
        <a
          sapper:prefetch
          href="/blog/"
          class="bx--header__menu-item"
          role="menuitem"
          tabindex="0"
          aria-current="{segment === 'blog' ? 'page' : undefined}"
        >
          <span class="bx--text-truncate--end">Blog</span>
        </a>
      </li>
      <li>
        <a
          sapper:prefetch
          href="/events/"
          class="bx--header__menu-item"
          role="menuitem"
          tabindex="0"
          aria-current="{segment === 'events' ? 'page' : undefined}"
        >
          <span class="bx--text-truncate--end">Events</span>
        </a>
      </li>

      <li>
        <a
          sapper:prefetch
          href="/about/"
          class="bx--header__menu-item"
          role="menuitem"
          tabindex="0"
          aria-current="{segment === 'about' ? 'page' : undefined}"
        >
          <span class="bx--text-truncate--end">About</span>
        </a>
      </li>
    </ul>
  </nav>
</header>
