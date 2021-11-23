<script>
  import { onMount } from "svelte";
  import { Menu24, Close24 } from "carbon-icons-svelte";
  import { Button } from "carbon-components-svelte";

  export let segment;

  const navItems = [
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
  let isMobile = false;

  function mqHandler({ matches }) {
    isMobile = matches;
  }

  onMount(() => {
    const mq = window.matchMedia(`(max-width:66rem)`);
    mq.addEventListener("change", mqHandler);
    mqHandler(mq);
  });
</script>

<style lang="scss">
  .bx--header {
    height: auto;
    position: relative;
    display: block;
    background-color: var(--gray-90);
  }

  .bx--header__name {
    padding: 0;
  }

  .bx--header__nav {
    display: block;
  }

  :global(.bx--header
      .bx--header__action.bx--header__menu-trigger.bx--header__menu-toggle) {
    display: none;
    margin-right: 0.5rem;
  }

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
    .bx--header {
      height: auto;
    }

    .bx--header__nav {
      display: none;
      height: auto;
      width: auto;
      position: absolute;
      top: 3rem;
      right: 0;
      background: rgba(0, 0, 0, 0.8);

      &.expanded {
        display: block;
      }
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

    :global(.bx--header
        .bx--header__action.bx--header__menu-trigger.bx--header__menu-toggle) {
      display: flex;
    }
  }
</style>

<header class="bx--header">
  <div class="bx--grid">
    <div class="bx--row">
      <!-- logo -->
      <div class="bx--col-lg-2 bx--col-md-7 bx--col-sm-3">
        <a
          sapper:prefetch
          href="/"
          class="bx--header__name"
          aria-label="Home page"
        >
          <img
            width="100"
            height="29"
            src="img/logos/cal-adapt_logo.svg"
            alt=""
          />
        </a>
      </div>

      <!-- nav -->
      <div class="bx--col-lg-14 bx--col-md-0 bx--col-sm-0">
        <nav
          aria-label="Main menu"
          class="bx--header__nav"
          class:expanded="{open}"
        >
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
                  on:click="{() => isMobile && (open = !open)}"
                >
                  <span class="bx--text-truncate--end">{item.label}</span>
                </a>
              </li>
            {/each}
          </ul>
        </nav>
      </div>

      <!-- menu btn -->
      <div class="bx--col-lg-0 bx--col-md-1 bx--col-sm-1">
        <Button
          size="small"
          icon="{open ? Close24 : Menu24}"
          iconDescription="{open ? 'Close menu' : 'Open menu'}"
          tooltipPosition="left"
          on:click="{() => (open = !open)}"
          class="bx--header__action bx--header__menu-trigger bx--header__menu-toggle"
        />
      </div>
    </div>
  </div>
</header>
