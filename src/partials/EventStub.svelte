<script>
  import { Tag } from "carbon-components-svelte";
  export let event;

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const tagTypes = {
    data: "purple",
    tool: "cyan",
    webinar: "blue",
  };
</script>

<style lang="scss">
  .card-post a {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
  }

  .card-body {
    h3 {
      margin: 0.5rem 0 1rem;
    }
    p {
      margin-bottom: 0;
    }
  }

  .card-meta {
    display: block;
    margin-bottom: 1rem;
    color: #506690;
  }
</style>

<article class="card card-post shadow lift">
  <a
    class="stretched-link"
    rel="prefetch"
    href="blog/{event.slug}/"
    title="Read more"
  >
    <div class="card-img">
      <img src="/img/blog/{event.metadata.image}" alt="..." />
    </div>
    <div class="card-body">
      <div>
        {#each event.metadata.tags as tag}
          <Tag type="{tagTypes[tag]}" title="{tag}">{capitalize(tag)}</Tag>
        {/each}
      </div>
      <h3>
        {event.metadata.title}
      </h3>
      <span class="card-meta">
        <time datetime="{event.metadata.pubdate}"
          >{event.metadata.eventdatestring}</time
        >
        <p>{event.metadata.location}, {event.metadata.time}</p>
      </span>
    </div>
  </a>
</article>
