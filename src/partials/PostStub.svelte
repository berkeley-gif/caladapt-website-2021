<script>
  import { Tag } from "carbon-components-svelte";
  export let post;

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const tagTypes = {
    data: "purple",
    tool: "cyan",
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
    href="blog/{post.slug}/"
    title="Read more"
  >
    <div class="card-img">
      <img src="/img/blog/{post.metadata.image}" alt="..." />
    </div>
    <div class="card-body">
      <div>
        {#each post.metadata.tags as tag}
          <Tag type="{tagTypes[tag]}" title="{tag}">{capitalize(tag)}</Tag>
        {/each}
      </div>
      <h3>
        {post.metadata.title}
      </h3>
      <span class="card-meta">
        <time datetime="{post.metadata.pubdate}"
          >{post.metadata.datestring}</time
        >, {post.metadata.author}
      </span>
      <p>
        {post.metadata.snippet}
      </p>
    </div>
  </a>
</article>
