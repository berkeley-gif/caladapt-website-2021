<script>
  import { Legend } from "~/components/tools/Map";
  const ramp = [
    "var(--gray-10)",
    "#ffffcc",
    "#d9f0ca",
    "#b3e1c8",
    "#8dd3c7",
    "#67c4c5",
    "#41b6c4",
    "#3a95b8",
    "#3375ac",
    "#2c54a0",
    "#253494",
    "#00001d",
  ];
  const values = [
    "0-1",
    "1-4",
    "4-8",
    "8-12",
    "12-16",
    "16-20",
    "20-24",
    "24-28",
    "28-32",
    "32-36",
    "36–40",
    ">40",
  ];
  const height = 272;
</script>

<Legend title="SWE (inches)" {...{ ramp, values, height }} />
