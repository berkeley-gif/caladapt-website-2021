<script>
  // NOTE: this Search box element only geocodes using the MapBox geocoder
  // it does not currently use the Cal-Adapt API boundary lookup
  import { createEventDispatcher, onMount } from "svelte";
  import { Search } from "carbon-components-svelte";
  import { geocode } from "~/helpers/geocode";

  const dispatch = createEventDispatcher();
  const description = "Enter a place name or address";
  const searchInputId = "map-search-box";
  const datalistId = "search-suggestions";

  let suggestions = [];
  let value = "";
  let searchInput;

  $: console.log(suggestions.map((d) => d.title));

  onMount(() => {
    searchInput = document.getElementById("map-search-box");
    searchInput.setAttribute("list", datalistId);
  });

  function handleInput(event) {
    if (!suggestions.length) {
      return;
    }
    const found = suggestions.find((d) => d.title === event.target.value);
    if (found) {
      searchInput.setCustomValidity("");
      dispatch("change", found);
    } else {
      searchInput.setCustomValidity("Please select a location.");
    }
    searchInput.reportValidity();
  }

  async function handleKeydown(event) {
    const {
      key,
      target: { value },
    } = event;
    let flag = false;

    if (key === "Escape" || key === "Esc") {
      event.target.blur();
      clearSearch();
      flag = true;
    }

    if (key === "Enter" && value) {
      await handleSearch();
      flag = true;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  async function handleSearch() {
    if (!suggestions.length) {
      suggestions = await getResults(value);
    }
  }

  async function getResults(searchStr) {
    try {
      const response = await geocode(searchStr);
      if (response && response.features && response.features.length) {
        return response.features.map(({ place_name, ...rest }) => ({
          ...rest,
          title: place_name,
        }));
      }
    } catch (error) {
      console.warn(error);
    }
    return [];
  }

  function clearSearch() {
    value = "";
    suggestions = [];
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
    bind:value
    on:input="{handleInput}"
    on:keydown="{handleKeydown}"
    on:clear="{clearSearch}"
    id="{searchInputId}"
    size="sm"
    labelText="{description}"
    placeholder="{description}"
  />
  <datalist id="{datalistId}">
    {#if suggestions.length}
      {#each suggestions as item (item.id)}
        <option value="{item.title}">{item.title}</option>
      {/each}
    {/if}
  </datalist>
</div>
