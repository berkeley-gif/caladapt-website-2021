<script>
  import { onMount } from "svelte";
  import { Menu32, Close32 } from "carbon-icons-svelte";
  import { Button } from "carbon-components-svelte";
  import NavItems from "./NavItems.svelte";

  export let segment;

  const navItems = [
    {
      label: "Tools",
      path: "/tools/",
      useOffset: false,
    },
    {
      label: "Data",
      path: "/data/",
      useOffset: true,
    },
    {
      label: "Help",
      path: "/help/",
      useOffset: true,
    },
    {
      label: "Blog",
      path: "/blog/",
      useOffset: false,
    },
    {
      label: "Events",
      path: "/events/",
      useOffset: true,
    },
    {
      label: "About",
      path: "/about/",
      useOffset: true,
    },
  ];
  const home = {
    label: "Home",
    path: "/",
    useOffset: false,
  };

  let open = false;
  let isMobile = false;

  $: curNavItem =
    navItems.find((item) => item.label.toLowerCase() === segment) || home;

  function mqHandler({ matches }) {
    isMobile = matches;
  }

  function handleNavItemClick() {
    open != open;
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
</style>

<header class="bx--header">
  <div class="bx--grid">
    <div class="bx--row">
      <!-- logo -->
      <div
        class="bx--col-lg-2 bx--col-md-7 bx--col-sm-1"
        class:bx--offset-lg-2="{curNavItem.useOffset}"
      >
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
      <div
        class="bx--col-md-0 bx--col-sm-0"
        class:bx--col-lg-12="{curNavItem.useOffset}"
        class:bx--col-lg-14="{!curNavItem.useOffset}"
      >
        <NavItems navItems="{navItems}" segment="{segment}" />
      </div>

      <!-- md to sm viewport menu btn -->
      <div
        class="bx--col-lg-0 bx--col-md-1 bx--col-sm-3"
        style="padding-left:0;padding-right:0;"
      >
        <Button
          kind="secondary"
          icon="{open ? Close32 : Menu32}"
          iconDescription="{open ? 'Close menu' : 'Open menu'}"
          tooltipPosition="left"
          on:click="{() => (open = !open)}"
          class="menu-toggle"
          style="background-color: var(--gray-90); float:right;"
        />

        {#if isMobile && open}
          <NavItems
            navItems="{navItems}"
            segment="{segment}"
            handleClick="{handleNavItemClick}"
          />
        {/if}
      </div>
    </div>
  </div>
</header>
