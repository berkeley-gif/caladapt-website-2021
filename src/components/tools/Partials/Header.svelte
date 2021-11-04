<script>
  import { Banner } from "~/partials";
  export let title;
  export let iconPaths;
  export let description;
</script>

<Banner
  titleText="{title}"
  subtitleText="{description}"
  iconPaths="{iconPaths}"
  useOffset="{false}"
  bgColor="var(--gray-10)"
  textColor="var(--text-01)"
  overlayColor="transparent"
/>
