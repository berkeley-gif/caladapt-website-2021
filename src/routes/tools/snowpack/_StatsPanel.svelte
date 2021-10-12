<script>
  import { RangeAvg } from "~/components/tools/Stats";

  export let units;
  export let data;
  export let formatFn;
</script>

<ul class="stats">
  <li class="block">
    <RangeAvg
      units="{units}"
      data="{data}"
      series="{'historical'}"
      period="{'baseline'}"
      format="{formatFn}"
    />
  </li>
  <li class="block">
    <RangeAvg
      units="{units}"
      data="{data}"
      series="{'future'}"
      period="{'mid-century'}"
      format="{formatFn}"
    />
  </li>
  <li class="block">
    <RangeAvg
      units="{units}"
      data="{data}"
      series="{'future'}"
      period="{'end-century'}"
      format="{formatFn}"
    />
  </li>
</ul>
