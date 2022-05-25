<script>
  export let geocodeResults = [];
  export let selectSuggestion = () => {};
  export let clearSearch = () => {};
</script>

<style lang="scss">
  .suggestions-wrapper {
    background-color: var(--white);
    border-radius: 4px;
    position: absolute;
    width: 100%;
    left: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 1000;
    overflow: hidden;
    box-shadow: var(--box-shadow);

    .suggestions .suggestion {
      cursor: default;
      display: block;
      padding: 3px 12px;
      color: var(--gray-80);
    }

    .suggestions .suggestion:hover {
      background-color: var(--gray-20);
      text-decoration: none;
      cursor: pointer;
    }

    .suggestion-text {
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 0.8rem;
    }

    .suggestion-category {
      display: block;
      margin: 0.5rem;
      font-size: 0.9rem;
      font-weight: bold;
    }
  }
</style>

<div class="suggestions-wrapper">
  {#each geocodeResults as item}
    <span class="suggestion-category">{item.category}</span>
    <ul class="suggestions">
      {#if item.data.length > 0}
        {#each item.data as opt}
          <li>
            <div
              class="suggestion"
              on:click="{() =>
                selectSuggestion({
                  ...opt,
                  geocoder: item.geocoder,
                })}"
            >
              <div class="suggestion-text">{opt.title}</div>
            </div>
          </li>
        {/each}
      {:else}
        <li>
          <div class="suggestion" on:click="{() => clearSearch()}">
            <div class="suggestion-nodata">No Results Found</div>
          </div>
        </li>
      {/if}
    </ul>
  {/each}
</div>
