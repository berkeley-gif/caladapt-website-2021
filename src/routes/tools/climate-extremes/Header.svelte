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

<style type="scss">
  .header {
    padding: 2rem;
    background: rgba(218, 222, 225, 0.25);
  }

  .secondary-nav {
    width: 100%;
    background: rgba(250, 251, 251, 1);
    top: 0;
    border-bottom: 1px solid #dadee1;
    z-index: 3;
    background: #9fa6ac;
  }

  .secondary-nav ul {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    text-transform: uppercase;
    margin: 0 2rem;
  }

  .secondary-nav ul li {
    margin-right: 1rem;
    cursor: pointer;
    padding: 0.5rem;
    color: #000;
  }

  .secondary-nav ul li:hover {
    background: rgba(154, 201, 202, 0.5);
  }

  .secondary-nav ul li.active {
    font-weight: 600;
  }
</style>

<div class="header">
  <h1>Extreme Weather</h1>
  <p class="lead">
    Explore extreme weather events for baseline and future climates.
  </p>
</div>
<div class="secondary-nav is-sticky">
  <ul>
    <li
      data-section="select"
      class="link"
      class:active="{currentView === 'select' ? true : false}"
      on:click="{selectView}"
    >
      Explore Data
    </li>
    <li
      data-section="about"
      class="link"
      class:active="{currentView === 'about' ? true : false}"
      on:click="{selectView}"
    >
      About the Tool
    </li>
    <li
      data-section="data"
      class="link"
      class:active="{currentView === 'data' ? true : false}"
      on:click="{selectView}"
    >
      Data Sources
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
