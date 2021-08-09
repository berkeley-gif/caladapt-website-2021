<script>
  import { createEventDispatcher } from "svelte";
  import { getSiblings } from "../../helpers/utilities.js";

  export let tags;

  const dispatch = createEventDispatcher();
  function selectTag({ target, tag }) {
    const siblings = getSiblings(target);
    siblings.forEach((el) => el.classList.remove("active"));
    target.classList.add("active");
    dispatch("click", { tag });
  }
</script>

<style lang="scss">
  .badge {
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
      transform: translate3d(0, -1px, 0);
      opacity: 0.9;
    }
  }
</style>

<ul class="list d-flex">
  {#each tags as tag, i}
    <li class="me-2">
      <span
        class="badge rounded-pill text-uppercase h6 bg-secondary"
        on:click|preventDefault="{(e) => selectTag({ target: e.target, tag })}"
      >
        {tag}
      </span>
    </li>
  {/each}
</ul>
