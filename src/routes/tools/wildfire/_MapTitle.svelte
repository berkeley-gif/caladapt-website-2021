<script>
  export let scenario;
  export let climvar;
  export let year;
  export let model;
  export let period;
  export let month;

  let indicatorPeriod;

  $: {
    if (climvar === "fire" && period === "year") {
      indicatorPeriod = "Modeled Annual Area Burned";
    } else if (climvar === "fire" && period === "month") {
      indicatorPeriod = `Modeled ${month} Area Burned`;
    } else if (climvar === "fireprob" && period === "year") {
      indicatorPeriod = "Estimated Decadal Fire Probability";
    } else if (climvar === "fireprob" && period === "month") {
      indicatorPeriod = `Estimated ${month} Fire Probability`;
    } else {
      throw new Error("Unknown indicatorPeriod");
    }
  }
</script>

<style>
  div {
    margin-top: 0;
    font-weight: 400;
  }
</style>

<div class="h3 block">
  <span class="annotate">{indicatorPeriod}</span> over
  <span class="annotate">{year} – {year + 9}</span>
  under a {scenario} and Central Population Growth scenario for
  <span class="annotate">{model}</span>.
</div>
