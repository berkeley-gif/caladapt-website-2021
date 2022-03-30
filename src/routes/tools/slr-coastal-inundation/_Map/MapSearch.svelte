<script>
  import { createEventDispatcher } from "svelte";
  import Search from "cal-adapt-svelte-components/Search/Search.svelte";
  import { geocode } from "~/helpers/geocode";
  import { debounce } from "~/helpers/utilities";

  const dispatch = createEventDispatcher();
  const inputDebounceMs = 350;

  let searchValue = "";
  let suggestions = [];

  function selectSearchResult(event) {
    if (event && event.detail) {
      const feature = event.detail;
      searchValue = feature.title;
      suggestions = [];
      dispatch("change", feature);
    }
  }

  async function handleSearchInput(event) {
    const { value } = event.target;
    if (value && value.length >= 3) {
      await handleSearch();
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
          value: place_name,
        }));
      }
    } catch (error) {
      console.warn(error);
    }
    return [];
  }
</script>

<style>
  div {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    width: 24rem;
  }
</style>

<div>
  <Search
    bind:searchValue
    on:input="{debounce(handleSearchInput, inputDebounceMs)}"
    on:select="{selectSearchResult}"
    suggestions="{suggestions}"
  />
</div>
