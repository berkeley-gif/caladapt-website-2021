<script>
  export let items = [
    { href: "/", text: "Dashboard" },
    { href: "/reports", text: "Annual reports" },
    { href: "/reports/2019", text: "2019" },
  ];

  import { Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";
</script>

<Breadcrumb noTrailingSlash {...$$restProps}>
  {#each items as item, i}
    <BreadcrumbItem href="{item.href}" isCurrentPage="{i === items.length - 1}">
      {item.text}
    </BreadcrumbItem>
  {/each}
</Breadcrumb>
