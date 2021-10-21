<script>
  import { createEventDispatcher } from "svelte";
  import { InlineNotification } from "carbon-components-svelte";
  import {
    climvarStore,
    thresholdStore,
    extremesStore,
    locationStore,
    doyStore,
    hadisdStore,
    baseline,
    thresholdProbability,
    thresholdProps,
    thresholdExceedances,
  } from "./_store";
  import {
    EXTREME_EVENT_DESCRIPTION,
    PROPBABILITY_DESCRIPTION,
  } from "./_constants";
  import { getObservedReturnLevels, getQueryParams } from "./_data";
  import { LearnMoreButton } from "~/components/tools/Partials";

  const dispatch = createEventDispatcher();
  const { climvar } = climvarStore;
  const { doyText, doyRangeStart, doyRangeEnd } = doyStore;
  const { hadisdDateRange } = hadisdStore;

  let confidenceIntervals;
  let probability_description_with_ci = PROPBABILITY_DESCRIPTION;

  async function getThresholdCI() {
    try {
      const config = {
        climvarId: $climvarStore,
      };
      const { params } = getQueryParams({
        location: $locationStore,
        doy: $doyStore,
        extype: $extremesStore,
        imperial: true,
      });
      params.intervals = $thresholdProbability.rp;
      const returnLevels = await getObservedReturnLevels(config, params);
      const level = returnLevels[0].levels[0];
      const { lowerci, upperci } = level;
      confidenceIntervals = `[${lowerci.toFixed(1)}, ${upperci.toFixed(1)}]`;
      probability_description_with_ci = `${PROPBABILITY_DESCRIPTION}
      <p>The <strong>95% Confidence Intervals</strong> for your selected 
      threshold value are <strong>[${confidenceIntervals}] ${$climvar.units.imperial}</strong></p>`;
    } catch (err) {
      confidenceIntervals = "[]";
      probability_description_with_ci = `${PROPBABILITY_DESCRIPTION}
      <p>Unable to calculate the <strong>95% Confidence Intervals</strong> for your selected 
      threshold value</p>`;
    }
  }

  $: if (!$thresholdProps.invalid && $thresholdProbability.rp) {
    getThresholdCI();
  }

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }
</script>

<style lang="scss">
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    grid-gap: var(--spacing-16);

    .wide {
      grid-column-end: span 2;
    }
  }

  .block ul {
    margin-top: -0.5rem;
  }
</style>

<ul class="stats">
  <li class="block wide">
    {#if $thresholdProps.invalid}
      <InlineNotification
        hideCloseButton
        lowContrast
        kind="warning"
        title="Check Threshold:"
        subtitle="{$thresholdProps.invalidText}"
      />
    {:else}
      <p>
        A daily <span class="annotate">{$climvar.title}</span> of
        <span class="annotate threshold"
          >{$thresholdStore} {$climvar.units.imperial}</span
        >
        around <span class="annotate">{$doyText}</span> is a
        <span class="annotate">{$thresholdProbability.label}</span>
        event. Based on Extreme Value Theory and historical observations (1991-2020),
        the probability of daily
        <span class="annotate">{$climvar.title}</span>
        being {$extremesStore}er than
        <span class="annotate threshold"
          >{$thresholdStore} {$climvar.units.imperial}</span
        >
        at least once between <span class="annotate">{$doyRangeStart}</span> and
        <span class="annotate">{$doyRangeEnd}</span>
        is {$thresholdProbability.append}
        <span class="annotate">{$thresholdProbability.value}%</span>.
      </p>
      <p>
        In the Baseline Period (1991-2020), a daily <span class="annotate"
          >{$climvar.title}</span
        >
        {$extremesStore}er than
        <span class="annotate threshold"
          >{$thresholdStore} {$climvar.units.imperial}</span
        >
        occurred <span class="annotate">{$thresholdExceedances}</span> times
        between <span class="annotate">{$doyRangeStart}</span> and
        <span class="annotate">{$doyRangeEnd}</span>.
      </p>
      <LearnMoreButton
        cta="{'Extreme Events'}"
        on:click="{() =>
          showLearnMore({
            content: EXTREME_EVENT_DESCRIPTION,
            header: 'What is an extreme event?',
          })}"
      />
      <LearnMoreButton
        cta="{'Exceedance Probability'}"
        on:click="{() =>
          showLearnMore({
            content: probability_description_with_ci,
            header: 'What is Exceedance Probability?',
          })}"
      />
    {/if}
  </li>
  <li class="block">
    {#if $baseline}
      <p>
        From the available record ({$hadisdDateRange}) between
        <span class="annotate">{$doyRangeStart}</span>
        and <span class="annotate">{$doyRangeEnd}</span>:
      </p>
      <ul>
        <li>
          A <span class="annotate">Record Low</span> of
          <span class="annotate"
            >{$baseline.low.value} {$climvar.units.imperial}</span
          >
          was observed on <span class="annotate">{$baseline.low.date}</span>
        </li>
        <li>
          A <span class="annotate">Record High</span> of
          <span class="annotate"
            >{$baseline.high.value} {$climvar.units.imperial}</span
          >
          was observed on <span class="annotate">{$baseline.high.date}</span>
        </li>
      </ul>
    {:else}
      <p>
        From the available record between <span class="annotate">-</span> and
        <span class="annotate">-</span>:
      </p>
      <ul>
        <li>
          A <span class="annotate">Record Low</span> of
          <span class="annotate">-</span>
          was observed on <span class="annotate">-</span>
        </li>
        <li>
          A <span class="annotate">Record High</span> of
          <span class="annotate">-</span>
          was observed on <span class="annotate">-</span>
        </li>
      </ul>
    {/if}
  </li>
</ul>
