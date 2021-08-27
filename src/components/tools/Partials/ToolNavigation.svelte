<script>
  export let selected;
  export let items = [
    {
      id: "explore",
      label: "Explore Data",
    },
    {
      id: "about",
      label: "About the Tool",
    },
    {
      id: "resources",
      label: "Resources",
    },
    {
      id: "help",
      label: "Help",
    },
  ];

  function selectView(e) {
    selected = e.target.dataset.section;
    const el = document.getElementById(selected);
    window.scrollTo({
      top: el.offsetTop - 50,
      behavior: "smooth",
    });
  }
</script>

<div class="secondary-nav is-sticky">
  <ul>
    {#each items as item}
      <li
        data-section="{item.id}"
        class="link"
        class:active="{selected === item.id ? true : false}"
        on:click="{selectView}"
      >
        {item.label}
      </li>
    {/each}
  </ul>
</div>
