<script>
  export let segment;

  const navItems = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Tools",
      path: "/tools/",
    },
    {
      label: "Data",
      path: "/data/",
    },
    {
      label: "Help",
      path: "/help/",
    },
    {
      label: "Blog",
      path: "/blog/",
    },
    {
      label: "Events",
      path: "/events/",
    },
    {
      label: "About",
      path: "/about/",
    },
  ];

  let open = false;
</script>

<style lang="scss">
  .main-nav {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 4.375rem;
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
  <button
    aria-label="Open menu"
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
      alt=""
      ><path
        d="M2 14.8H18V16H2zM2 11.2H18V12.399999999999999H2zM2 7.6H18V8.799999999999999H2zM2 4H18V5.2H2z"
      ></path></svg
    >
  </button>
  <nav
    aria-label="Main menu"
    class="bx--header__nav"
    class:expanded="{open}"
    on:click="{() => (open = !open)}"
  >
    <ul class="bx--header__menu-bar desktop">
      {#each navItems as item, i}
        <li>
          <a
            sapper:prefetch
            href="{item.path}"
            class="{!i ? 'bx--header__name' : 'bx--header__menu-item'}"
            aria-label="{!i ? item.label : ''}"
            aria-current="{(!i && segment === undefined) ||
            segment === item.label.toLowerCase()
              ? 'page'
              : undefined}"
          >
            {#if !i}
              <img src="img/logos/cal-adapt_logo.svg" class="logo" alt="" />
            {:else}
              <span class="bx--text-truncate--end">{item.label}</span>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</header>
