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
      text: `Download chart in image format that can be used in 
      presentations or other documents`,
    },
    {
      format: 'svg',
      text: `Download chart in vector format that can be customized in graphic software like Adobe Illustrator`,
    },
    {
      format: 'csv',
      text: `Download data used to create this chart`,
    },
    {
      format: 'pdf',
      text: `Download chart, map and supporting text for printing or sharing`,
    },
  ];

  const dispatch = createEventDispatcher();

  let selected = 'png';

  function update() {
    dispatch('download', selected);
  }
</script>

<Modal
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  bind:open
  modalHeading="Download"
  on:submit={update}
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