<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Modal,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListInput,
  } from 'carbon-components-svelte';
  import CheckmarkFilled16 from 'carbon-icons-svelte/lib/CheckmarkFilled16';

  export let open = false;
  export let options = [
    {
      format: 'png',
      text: `Chart in image format. Use it in 
      presentations or other documents.`,
    },
    {
      format: 'svg',
      text: `Chart in vector format. Use it in 
      documents or customize it further with graphic software like Inkscape or Adobe Illustrator`,
    },
    {
      format: 'csv',
      text: `Data used to create this chart. Use it for further analysis.`,
    },
    {
      format: 'pdf',
      text: `Document with chart, map and supporting text for printing or sharing.`,
    },
  ];

  const dispatch = createEventDispatcher();

  let selected = 'png';

  function download() {
    dispatch('download', selected);
  }
</script>

<Modal
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  bind:open
  modalHeading="Download"
  on:submit={download}
  on:open
  on:close>
  <StructuredList selection bind:selected>
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>Save as</StructuredListCell>
        <StructuredListCell head>How to Use</StructuredListCell>
        <StructuredListCell head>{''}</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#each options  as item}
        <StructuredListRow label for="row-{item.format}">
          <StructuredListCell>{item.format.toUpperCase()}</StructuredListCell>
          <StructuredListCell>{item.text}</StructuredListCell>
          <StructuredListInput
            id="row-{item.format}"
            value="{item.format}"
            title="save as {item.format}"
            name="row-{item.format}"
          />
          <StructuredListCell>
            <CheckmarkFilled16
              class="bx--structured-list-svg"
              aria-label="select an option"
              title="select an option"
            />
          </StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
</Modal>