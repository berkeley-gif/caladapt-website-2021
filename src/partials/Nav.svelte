<script>
  import { onMount } from "svelte";

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
    height: 4.375rem;
    position: relative;
    justify-content: space-between;
    background-color: var(--gray-90);
  }

  .bx--header__nav {
    display: block;
  }

  .bx--header__menu-toggle {
    display: none;
    margin-right: 0.5rem;
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

    .bx--header__menu-toggle {
      display: flex;
    }
  }
</style>

<header class="bx--header">
  <a
    sapper:prefetch
    href="/"
    class="bx--header__name"
    aria-label="Home page"
    aria-current="{segment === undefined ? 'page' : undefined}"
  >
    <img src="img/logos/cal-adapt_logo.svg" class="logo" alt="" />
  </a>
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

  <nav aria-label="Main menu" class="bx--header__nav" class:expanded="{open}">
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
</header>
