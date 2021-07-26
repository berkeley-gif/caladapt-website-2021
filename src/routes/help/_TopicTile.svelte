<style lang="scss">
  .tile-wrapper {
    display: block;
    position: relative;
    width: 225px;
    margin: 1rem;
  }

  .tile-anchor {
    text-decoration: none;
    color: var(--gray-100);

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }
  }

  .tile--content {
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  h2,
  p {
    color: var(--gray-100);
    text-decoration: none;
  }

  h2 {
    font-size: 1.125rem;
    font-weight: bold;
  }

  p {
    font-size: 1rem;
  }
</style>

<li class="tile-wrapper lift shadow">
  <Tile>
    <div class="tile--content">
      <h2>
        <a class="tile-anchor" href="help/get-started/{topic.slug}"
          >{topic.title}</a
        >
      </h2>
      <p>{topic.text}</p>
      <Button kind="ghost" aria-hidden class="learn-more">Learn more</Button>
    </div>
  </Tile>
</li>

<script>
  import { Button, Tile } from "carbon-components-svelte";

  export let topic = {
    title: "",
    text: "",
  };
</script>
