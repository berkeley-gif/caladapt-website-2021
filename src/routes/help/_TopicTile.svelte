<style lang="scss">
  .tile-wrapper,
  .tile--content {
    display: flex;
    flex-direction: column;
  }

  .tile-wrapper {
    position: relative;
    padding: 1rem;
    background-color: var(--white);

    &:focus-within {
      box-shadow: 0 0 0 0.25rem;
    }
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
    max-width: 60ch;
    flex-grow: 1;
    justify-content: space-between;

    & > * + * {
      margin-top: 0.75rem;
    }

    &:last-child {
      margin-top: auto;
    }

    &:nth-last-child(2) {
      margin-bottom: 0.75rem;
    }
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

  small {
    color: var(--link-01);
  }
</style>

<li class="tile-wrapper lift shadow">
  <div class="tile--content">
    <h2>
      <a class="tile-anchor" href="help/get-started/{topic.slug}"
        >{topic.title}</a
      >
    </h2>
    <p>{topic.text}</p>
    <small aria-hidden="true">Learn more</small>
  </div>
</li>

<script>
  export let topic = {
    title: "A Title",
    text: "Some descriptive text",
  };
</script>
