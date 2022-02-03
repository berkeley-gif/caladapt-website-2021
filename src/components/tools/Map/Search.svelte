<script>
  import { createEventDispatcher } from "svelte";
  import { Search } from "carbon-components-svelte";

  const dispatch = createEventDispatcher();
  const description = "Enter a place name or address";

  let search;
  let value = "";

  function handleInput({ target: { value } }) {
    console.log(value);
  }

  function handleKeydown(event) {
    const { key } = event;
    let flag = false;

    if (key === "Escape" || key === "Esc") {
      event.target.blur();
      clearSearch();
      flag = true;
    }

    if (key === "Enter") {
      // handle search
      console.log("search");
      flag = true;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function clearSearch() {
    value = "";
  }
</script>

<style lang="scss">
  div {
    width: 24rem;
    position: absolute;
    top: 12px;
    left: 12px;
    padding-left: 0.5rem;
    background-color: var(--white);

    &:focus-within {
      outline: 2px solid var(--support-03);
    }

    :global(.bx--search-input) {
      border-bottom: none;
    }

    :global(.bx--search-input:focus) {
      // outline created on parent element on focus
      outline: none;
    }
  }
</style>

<div>
  <Search
    bind:this="{search}"
    bind:value
    on:input="{handleInput}"
    on:keydown="{handleKeydown}"
    on:clear="{clearSearch}"
    id="map-search-box"
    size="sm"
    labelText="{description}"
    placeholder="{description}"
  />
</div>
