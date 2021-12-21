<script>
  import { Menu32, Close32 } from "carbon-icons-svelte";
  import { Button } from "carbon-components-svelte";
  import NavItems from "./NavItems.svelte";

  export let segment;
  export let useWideLayout;

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

  function handleNavItemClick() {
    open = !open;
  }
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
      <!-- logo & homepage link -->
      <div
        class="bx--col-lg-3 bx--col-md-2 bx--col-sm-1"
        class:bx--offset-lg-2="{!useWideLayout}"
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

      <!-- desktop nav -->
      <div
        class="bx--col-md-0 bx--col-sm-0"
        class:bx--col-lg-11="{!useWideLayout}"
        class:bx--col-lg-13="{useWideLayout}"
      >
        <NavItems navItems="{navItems}" segment="{segment}" />
      </div>

      <!-- md to sm viewport menu btn & nav -->
      <div
        class="bx--col-lg-0 bx--col-md-6 bx--col-sm-3"
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

        {#if open}
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
