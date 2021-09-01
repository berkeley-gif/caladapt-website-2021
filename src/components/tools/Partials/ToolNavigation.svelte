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

<style lang="scss">
  .secondary-nav {
    width: 100%;
    top: 0;
    border-bottom: 1px solid var(--gray-50);
    z-index: 3;
    background: var(--gray-30);

    ul {
      display: flex;
      flex-wrap: wrap;
      list-style-type: none;
      text-transform: uppercase;
      margin: 0 2rem;
    }

    ul li {
      margin-right: 1rem;
      cursor: pointer;
      padding: 0.5rem;
      color: #000;
    }

    ul li:hover {
      background: var(--gray-50);
    }

    ul li.active {
      font-weight: 600;
    }
  }
</style>

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
