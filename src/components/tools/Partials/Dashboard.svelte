<style lang="scss">
  .dashboard {
    display: flex;
    max-width: 99rem;
    margin: 2rem auto;

    .content {
      width: 75%;
      padding-right: 0;
    }

    .settings {
      width: 25%;
      padding-left: 0;
    }
  }

  .is-sticky {
    top: -1px;
  }

  @media (max-width: 1000px) {
    .dashboard {
      flex-direction: column;

      .content {
        width: 100%;
        padding-right: 1rem;
      }

      .settings {
        width: 100%;
        padding-left: 2rem;
      }
    }
  }

  @media (max-width: 672px) {
    .dashboard {
      .content {
        padding-right: 0;
      }

      .settings {
        padding-left: 1rem;
      }
    }
  }
</style>

<div class="dashboard">
  <div class="bx--grid bx--grid--narrow content">
    <div class="bx--row margin--v-16">
      <div
        class="bx--col-lg-4 bx--col-md-2 bx--col-sm-4 bx--aspect-ratio bx--aspect-ratio--1x1"
      >
        <slot name="map">map</slot>
      </div>
      <div class="bx--col-lg-12 bx--col-md-6 bx--col-sm-4">
        <slot name="title">title</slot>
      </div>
    </div>
    <div class="bx--row margin--v-16">
      <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
        <slot name="stats">stats</slot>
      </div>
    </div>
    <div class="bx--row margin--v-16">
      <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
        <slot name="graphic">graphic</slot>
      </div>
    </div>
  </div>
  <aside class="bx--grid bx--grid--condensed settings">
    <div class="is-sticky">
      <div class="bx--row margin--v-16">
        <div class="bx--col">
          <span class="h4">Change Settings:</span>
        </div>
      </div>
      <div class="bx--row margin--v-16">
        <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
          <slot name="settings">settings with columns</slot>
        </div>
      </div>
    </div>
  </aside>
</div>
