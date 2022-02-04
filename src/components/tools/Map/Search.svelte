<script>
  // NOTE: this Search box element only geocodes using the MapBox geocoder
  // it does not currently use the Cal-Adapt API boundary lookup
  import { createEventDispatcher } from "svelte";
  import { Button, Search } from "carbon-components-svelte";
  import { geocode } from "~/helpers/geocode";
  import { debounce } from "~/helpers/utilities";

  const dispatch = createEventDispatcher();
  const description = "Search for a place name or address";
  const inputDebounceMs = 350;

  let searchValue = "";
  let suggestions = [];

  function selectSearchResult(feature) {
    searchValue = feature.title;
    suggestions = [];
    dispatch("change", feature);
  }

  async function handleSearchInput(event) {
    const { value } = event.target;
    if (value && value.length >= 3) {
      await handleSearch();
    }
  }

  async function handleInputKeydown(event) {
    const {
      key,
      target: { value },
    } = event;
    let flag = false;

    if (key === "Escape" || key === "Esc") {
      clearSearch();
      flag = true;
    }

    if (key === "Enter" && value && suggestions.length) {
      selectSearchResult(suggestions[0]);
      flag = true;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  async function handleSearch() {
    suggestions = await getResults(searchValue);
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
    searchValue = "";
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

  ul,
  li {
    list-style: none;
  }

  ul {
    padding-left: 0.9rem !important;
  }
</style>

<div>
  <Search
    bind:value="{searchValue}"
    on:input="{debounce(handleSearchInput, inputDebounceMs)}"
    on:keydown="{handleInputKeydown}"
    on:clear="{clearSearch}"
    size="sm"
    labelText="{description}"
    placeholder="{description}"
  />
  {#if suggestions.length}
    <ul>
      {#each suggestions as item (item.id)}
        <li>
          <Button
            on:click="{() => selectSearchResult(item)}"
            size="small"
            kind="ghost">{item.title}</Button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>
