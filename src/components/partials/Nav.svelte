<script>
  export let segment;

  let open = false;
</script>

<header aria-label="Cal-Adapt Home" class="main-nav bx--header" role="banner">
  <a class="bx--header__name" aria-current="{segment === undefined ? 'page' : undefined}" href="/">
    <img
      src="img/logos/cal-adapt_logo.svg"
      class="logo"
      alt="Cal-Adapt logo"
    />
  </a>
  <button
    type="button"
    title="Open menu"
    on:click={() => open = !open}
    class="bx--header__action bx--header__menu-trigger bx--header__menu-toggle">
      <svg data-carbon-icon="Menu20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" preserveAspectRatio="xMidYMid meet" role="img" focusable="false"><path d="M2 14.8H18V16H2zM2 11.2H18V12.399999999999999H2zM2 7.6H18V8.799999999999999H2zM2 4H18V5.2H2z"></path><title>Open Menu</title></svg>
  </button>
  <nav aria-label="Cal-Adapt" class="bx--header__nav" class:expanded={open}>
    <ul aria-label="Cal-Adapt" class="bx--header__menu-bar" role="menubar">
      <li>
        <a href="/tools/" class="bx--header__menu-item" role="menuitem" tabindex="0" aria-current="{segment === 'tools' ? 'page' : undefined}">
          <span class="bx--text-truncate--end">Tools</span>
        </a>
      </li>
      <li>
        <a href="/data/" class="bx--header__menu-item" role="menuitem" tabindex="0" aria-current="{segment === 'data' ? 'page' : undefined}">
          <span class="bx--text-truncate--end">Data</span>
        </a>
      </li>
      <li>
        <a href="/developer/" class="bx--header__menu-item" role="menuitem" tabindex="0" aria-current="{segment === 'developer' ? 'page' : undefined}">
          <span class="bx--text-truncate--end">Developer</span>
        </a>
      </li>
      <li>
        <a href="/help/" class="bx--header__menu-item" role="menuitem" tabindex="0" aria-current="{segment === 'help' ? 'page' : undefined}">
          <span class="bx--text-truncate--end">Help</span>
        </a>
      </li>
      <li>
        <a href="/blog/" class="bx--header__menu-item" role="menuitem" tabindex="0" aria-current="{segment === 'blog' ? 'page' : undefined}">
          <span class="bx--text-truncate--end">Blog</span>
        </a>
      </li>
      <li>
        <a href="/about/" class="bx--header__menu-item" role="menuitem" tabindex="0" aria-current="{segment === 'about' ? 'page' : undefined}">
          <span class="bx--text-truncate--end">About</span>
        </a>
      </li>
    </ul>
  </nav>
</header>