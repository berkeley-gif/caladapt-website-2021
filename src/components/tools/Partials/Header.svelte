<script>
  export let currentView;
  export let icons;

  function selectView(e) {
    currentView = e.target.dataset.section;
    const el = document.getElementById(currentView);
    window.scrollTo({
      top: el.offsetTop - 50,
      behavior: "smooth",
    });
  }
</script>

<!-- Banner -->
<div class="banner bg-gray-100">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <div class="center-row">
          {#if icons && icons.length > 0}
            {#each icons as icon}
              <img src="{icon}" alt="icon" class="icon" style="width:60px;" />
            {/each}
          {/if}
        </div>

        <slot name="title">
          <em>[Provide a title for this tool]</em>
        </slot>

        <slot name="description">
          <em>[Provide a brief description for this tool]</em>
        </slot>
      </div>
    </div>
  </div>
</div>

<!-- Tool navigation -->
<div class="secondary-nav is-sticky">
  <ul>
    <li
      data-section="explore"
      class="link"
      class:active="{currentView === 'explore' ? true : false}"
      on:click="{selectView}"
    >
      Explore Data
    </li>
    <li
      data-section="help"
      class="link"
      class:active="{currentView === 'help' ? true : false}"
      on:click="{selectView}"
    >
      Help
    </li>
    <li
      data-section="about"
      class="link"
      class:active="{currentView === 'about' ? true : false}"
      on:click="{selectView}"
    >
      About
    </li>
    <li
      data-section="resources"
      class="link"
      class:active="{currentView === 'resources' ? true : false}"
      on:click="{selectView}"
    >
      Resources
    </li>
  </ul>
</div>
