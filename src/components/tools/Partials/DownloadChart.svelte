<script>
  import {
    Modal,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListInput,
  } from "carbon-components-svelte";
  import CheckmarkFilled16 from "carbon-icons-svelte/lib/CheckmarkFilled16";
  import { csvFormat, csvFormatRows } from "d3-dsv";
  import { exportPNG, exportCSV } from "../../../helpers/export";
  import { notifier } from "../../../components/notifications";

  export let open = false;
  export let formats = ["png", "csv"];
  export let csvData;
  export let metadata;
  export let printContainer;
  export let printSkipElements = [];

  const items = [
    {
      format: "png",
      text: "Chart in image format. Use it in presentations or other documents.",
    },
    {
      format: "svg",
      text: "Chart in vector format. Use it in documents or customize it further with graphic software like Inkscape or Adobe Illustrator",
    },
    {
      format: "csv",
      text: "Data used to create this chart. Use it for further analysis. Any filters, options selected, and recalculations are also applied to the exported data.",
    },
    {
      format: "pdf",
      text: "Document with chart, map and supporting text for printing or sharing.",
    },
  ];

  $: options = items.filter((d) => formats.includes(d.format));

  let selected = "png";

  async function download() {
    try {
      switch (selected) {
        case "png":
          await exportPNG(printContainer, printSkipElements);
          break;
        case "csv":
          var csvWithMetadata = `
            ${csvFormatRows(metadata)} 
            \n \n
            ${csvFormat(csvData)}
          `;
          await exportCSV(csvWithMetadata);
          break;
        case "svg":
          // TODO: handle svg
          break;
        case "pdf":
          // TODO: handle pdf
          break;
        default:
        // Do nothing
      }
      notifier.success(
        "Download",
        `Successfully created ${selected} file`,
        "",
        2000
      );
    } catch (error) {
      notifier.error(
        "Download",
        `Error creating ${selected} file`,
        error,
        2000
      );
    } finally {
      open = false;
    }
  }
</script>

<Modal
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary="{() => (open = false)}"
  bind:open
  modalHeading="Download"
  on:submit="{download}"
  on:open
  on:close
>
  <StructuredList selection bind:selected>
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>Save as</StructuredListCell>
        <StructuredListCell head>How to Use</StructuredListCell>
        <StructuredListCell head>{""}</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#each options as item}
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
