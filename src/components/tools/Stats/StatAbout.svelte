<script>
  import { Modal } from "carbon-components-svelte";

  export let group;
  export let period;
  export let models;
  export let open = false;

  $: groupLabel = group.id.includes("model")
    ? `${group.label} data (${models.join(", ")} models)`
    : `${group.label} data`;
  $: note = `Summary statistics are calculated using values between ${period.start}
    and ${period.end} from ${groupLabel}.`;
</script>

<Modal
  id="stats-about"
  size="sm"
  passiveModal
  modalHeading="Summary Statistics"
  bind:open
  on:open
  on:close="{() => (open = false)}"
>
  <div>
    {note}
  </div>
</Modal>
