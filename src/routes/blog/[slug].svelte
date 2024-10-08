<script context="module">
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`blog/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import { Banner, NavBreadcrumb } from "~/partials";
  import { TweetButton } from "~/components/social-media";

  export let post;

  $: items = [
    { href: "/", text: "Home" },
    { href: "/blog/", text: "Blog" },
    {
      href: "",
      text: `${post.metadata.title}`,
    },
  ];
</script>

<style lang="scss">
  .post {
    padding: 2rem 0;
  }

  .content {
    padding: 1rem;

    :global(p),
    :global(li) {
      font-size: 1.125rem;
    }
  }

  .social {
    display: flex;
    align-items: center;
    font-size: 1rem;
  }

  .share {
    display: flex;
    justify-content: space-between;
  }

  .metadata {
    .author,
    .publish-date {
      max-width: 100%;
    }

    .author {
      margin-bottom: 0.25rem;
    }
  }
</style>

<svelte:head>
  <title>{post.metadata.title}</title>
  <meta name="twitter:title" content="{post.metadata.title}" />
  <meta name="twitter:description" content="{post.metadata.snippet}" />
  <meta name="Description" content="{post.metadata.snippet}" />
</svelte:head>

<Banner
  titleText="{post.metadata.title}"
  bannerImg="{`/img/blog/${post.metadata.image}`}"
/>

<div class="banner-breadcrumbs">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--offset-lg-2 bx--col-lg-10 bx--col-padding">
        <NavBreadcrumb items="{items}" />
      </div>
    </div>
  </div>
</div>

<div class="post">
  <div class="bx--grid">
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--offset-lg-2 bx--col-lg-10 metadata">
        <p class="author h5">
          {post.metadata.author}
        </p>
        <p class="publish-date">
          <time class="lead time" datetime="{post.metadata.pubdate}">
            {post.metadata.datestring}
          </time>
        </p>
      </div>
    </div>
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--offset-lg-2 bx--col-lg-10 content">
        {@html post.html}
      </div>
    </div>
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--offset-lg-2 bx--col-lg-10">
        <hr />
        <div class="share">
          <div class="social">
            <ul class="list-social">
              <li>
                <TweetButton
                  linkText="Share on Twitter"
                  text="{post.metadata.title}"
                  url="{typeof window !== 'undefined'
                    ? window.location.href
                    : ''}"
                />
              </li>
            </ul>
          </div>
          <div class="back">
            <p><a sapper:prefetch href="/blog/">Back to Cal-Adapt Blog</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
