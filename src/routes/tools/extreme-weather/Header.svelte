<script>
  export let currentView;

  function selectView(e) {
    currentView = e.target.dataset.section;
    const el = document.getElementById(currentView);
    window.scrollTo({
      top: el.offsetTop - 50,
      behavior: "smooth",
    });
  }
</script>

<div class="header">
  <h1>Extreme Weather</h1>
  <p class="lead">
    Explore extreme temperatures for past weather and present day at 38 weather
    stations across California. Each of the 38 stations has an observation
    period of greater than 30 years (1973 to present) from the HadISD global
    record and was identified as having high quality data for temperature. This
    dataset was produced for use by the energy sector.
  </p>
</div>
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
