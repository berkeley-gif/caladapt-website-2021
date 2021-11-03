<script>
  export let titleText = "Page Title";
  export let subtitleText = "";
  export let bgColor;
  export let bannerImg;
  export let bannerImgMobile;
  export let overlayColor = "var(--gray-100)";
  export let overlayOpacity = 0.6;
</script>

<style>
  .banner {
    min-height: 20rem;
    color: var(--white);
    background-image: var(--banner-img);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: var(--banner-bg-color, var(--gray-80));
    padding: var(--spacing-48) 0;
  }

  @media (max-width: 672px) {
    .banner {
      min-height: 14rem;
      background-image: var(--banner-img-mobile, var(--banner-img));
    }
  }

  .banner-content > * + * {
    margin-top: var(--banner-child-v-spacing, 2.5rem);
  }

  /* .banner h1 {
    font-size: 2rem;
  } */

  .overlay::before {
    opacity: var(--overlay-opacity);
    background-color: var(--overlay-color);
  }

  .banner > div {
    position: relative;
    z-index: 1;
  }

  .banner.bg-img p,
  .banner.bg-img h1 {
    filter: drop-shadow(0px 1px 2px var(--gray-100));
  }

  :global(.banner .lead a) {
    color: var(--white);
    text-decoration: solid underline var(--accent) 2px;
  }

  :global(.banner-breadcrumbs) {
    padding: 1rem;
    width: 100%;
    background: var(--gray-100);
    color: var(--white);
  }

  :global(.bx--breadcrumb-item .bx--link),
  :global(.bx--breadcrumb-item .bx--link:visited),
  :global(.bx--breadcrumb-item::after) {
    color: var(--teal-10);
  }
</style>

<div
  class="banner"
  class:bleed="{bannerImg}"
  class:bg-img="{bannerImg}"
  class:overlay="{overlayColor}"
  style="--banner-img:url({bannerImg});
    --banner-img-mobile:url({bannerImgMobile});
    --banner-bg-color:{bgColor};
    --overlay-color:{overlayColor};
    --overlay-opacity:{overlayOpacity};"
>
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--offset-lg-2 bx--col-lg-9 banner-content">
        <slot name="icons" />
        <h1>{titleText}</h1>
        {#if Array.isArray(subtitleText) && subtitleText.length}
          {#each subtitleText as textItem}
            <p class="lead">{@html textItem}</p>
          {/each}
        {:else}
          <p class="lead">{@html subtitleText}</p>
        {/if}
        <slot name="button" />
      </div>
    </div>
  </div>
</div>
