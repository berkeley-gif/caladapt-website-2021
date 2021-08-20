<script>
  export let iconPaths;
</script>

<!-- Banner -->
<div class="banner bg-gray-100">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <div class="center-row">
          {#if iconPaths && iconPaths.length > 0}
            {#each iconPaths as icon}
              <img src="{icon}" alt="icon" class="icon" />
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
