<script>
  export let titleText = "Page Title";
  export let subtitleText = "";
  export let textColor = "";
  export let bgColor = "";
  export let bannerImg = "";
  export let bannerImgMobile = "";
  export let overlayColor = "var(--gray-100)";
  export let overlayOpacity = 0.6;
  export let titleFontSize = "";
  export let titleFontWeight = "";
  export let useOffset = true;
  export let iconPaths = [];

  const getBackgroundImageValue = (str) =>
    /\//.test(str) ? `url(${str})` : str;
</script>

<style>
  .banner {
    min-height: 16rem;
    color: var(--white);
    background-image: var(--banner-img, none);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: var(--banner-bg-color, var(--gray-80));
    padding: var(--spacing-48) 0;
  }

  @media (max-width: 672px) {
    .banner {
      min-height: 14rem;
      background-image: var(--banner-img-mobile, var(--banner-img), none);
    }
  }

  .banner-content > * + * {
    margin-top: 1.5rem;
  }

  .banner h1,
  .banner p {
    color: var(--text-color, var(--white));
  }

  .banner h1 {
    font-size: var(--title-font-size, 2.625rem);
    font-weight: var(--title-font-weight, 600);
  }

  .banner.bg-img p,
  .banner.bg-img h1 {
    filter: drop-shadow(0px 1px 2px var(--gray-100));
  }

  .banner .lead {
    max-width: 56ch;
    font-weight: 400;
  }

  .banner :global(.lead a) {
    color: var(--white);
    text-decoration: solid underline var(--accent) 2px;
  }

  .banner--icons {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .overlay::before {
    opacity: var(--overlay-opacity);
    background-color: var(--overlay-color);
  }
</style>

<div
  class="banner"
  class:bleed="{bannerImg}"
  class:bg-img="{bannerImg}"
  class:overlay="{overlayColor}"
  style="--banner-img:{getBackgroundImageValue(bannerImg)};
    --banner-img-mobile:{getBackgroundImageValue(bannerImgMobile)};
    --banner-bg-color:{bgColor};
    --overlay-color:{overlayColor};
    --overlay-opacity:{overlayOpacity};
    --title-font-size:{titleFontSize};
    --title-font-weight:{titleFontWeight};
    --text-color:{textColor}"
>
  <div class="bx--grid">
    <!-- optional icons row -->
    {#if Array.isArray(iconPaths) && iconPaths.length}
      <div class:bx--offset-lg-2="{useOffset}" class="bx--row">
        <div class="bx--col banner--icons" aria-hidden="true">
          {#each iconPaths as path}
            <img src="{path}" alt="" class="icon" />
          {/each}
        </div>
      </div>
    {/if}

    <!-- main content row -->
    <div class="bx--row" class:bx--offset-lg-2="{useOffset}">
      <div class="banner-content bx--col-lg-10">
        <h1>{titleText}</h1>

        <!-- subtitle text can be a single or multiple paragraphs -->
        {#if Array.isArray(subtitleText) && subtitleText.length}
          {#each subtitleText as textItem}
            <p class="lead">{@html textItem}</p>
          {/each}
        {:else}
          <p class="lead">{@html subtitleText}</p>
        {/if}

        <!-- optional slot for a CTA button -->
        <slot name="button" />
      </div>
    </div>
  </div>
</div>
