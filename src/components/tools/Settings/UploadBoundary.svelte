<script>
  import { createEventDispatcher } from "svelte";
  import { FileUploader } from "carbon-components-svelte";

  // Helpers
  import {
    handleXHR,
    handle,
    convertFileToGeojson,
    validateShape,
  } from "./../../../helpers/utilities";
  import { formatFeature } from "./../../../helpers/geocode";

  let fileUploader;
  const fileUploadProps = {
    labelTitle: "",
    labelDescription:
      "Select a boundary from the dropdown list or upload your project area. Supported formats - zipped shapefile, GeoJSON, KML, WKT.",
    buttonLabel: "Upload File",
    accept: [".zip", ".json", ".geojson", ".kml", ".wkt"],
    iconDescription: "Clear file",
    id: "Upload",
    errorSubject: "",
    errorBody: "",
  };

  $: if (fileUploader) {
    fileUploader.clearFiles();
  }

  function clearFiles() {
    fileUploader.clearFiles();
    fileUploadProps.status = "";
    fileUploadProps.errorSubject = "";
    fileUploadProps.errorBody = "";
    fileUploadProps.invalid = false;
    dispatch("clear");
  }

  const dispatch = createEventDispatcher();

  async function processUpload(file) {
    console.log("....uploadng");
    fileUploadProps.status = "uploading";
    fileUploadProps.invalid = false;
    fileUploadProps.errorSubject = "";
    fileUploadProps.errorBody = "";
    const [validity, validityError] = await handleXHR(validateShape(file));
    if (validityError) {
      fileUploadProps.status = "edit";
      fileUploadProps.invalid = true;
      fileUploadProps.errorSubject = "Error";
      fileUploadProps.errorBody = String(validityError).split(":")[1];
      return;
    }
    fileUploadProps.status = "complete";
    const [geojson, geojsonError] = await handle(convertFileToGeojson(file));

    if (geojson && !geojsonError && geojson.features.length === 1) {
      fileUploadProps.errorSubject = "";
      fileUploadProps.errorBody = "";
      fileUploadProps.invalid = false;
      const location = formatFeature(geojson.features[0], "custom");
      location.title = file.name;
      dispatch("upload", { location });
      return;
    }

    if (geojson && geojsonError && geojson.features.length === 1) {
      fileUploadProps.errorSubject = "Warning";
      fileUploadProps.errorBody =
        "We can fetch data for this area but cannot display it on the inset map.";
      const location = formatFeature(geojson.features[0], "custom");
      location.title = file.name;
      dispatch("upload", { location });
      return;
    }

    if (geojson && geojson.features.length > 1) {
      fileUploadProps.status = "edit";
      fileUploadProps.invalid = true;
      fileUploadProps.errorSubject = "Error";
      fileUploadProps.errorBody =
        "The uploaded file has more than 1 geometry. The tool can display fetch data for only 1 geometry at a time.";
      return;
    }
  }
</script>

<style>
  :global(.bx--file__selected-file) {
    background: #f1f4f8;
  }
  :global(.bx--file__selected-file .bx--file-filename) {
    margin-bottom: 0;
  }
</style>

<FileUploader
  {...fileUploadProps}
  kind="tertiary"
  bind:this="{fileUploader}"
  on:add="{({ detail }) => {
    processUpload(detail[0]);
  }}"
  on:click="{clearFiles}"
/>
{#if fileUploadProps.errorSubject === "Warning" || fileUploadProps.errorSubject === "Error"}
  <span>{fileUploadProps.errorBody}</span>
{/if}
