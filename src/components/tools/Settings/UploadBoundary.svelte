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

  const dispatch = createEventDispatcher();
  const fileUploadProps = {
    labelTitle: "",
    labelDescription:
      "Select a boundary from the dropdown list or upload your project area. Supported formats - zipped shapefile, GeoJSON, KML, WKT.",
    buttonLabel: "Upload File",
    accept: [".zip", ".json", ".geojson", ".kml"],
    iconDescription: "Clear file",
    id: "Upload",
    errorSubject: "",
    errorBody: "",
  };

  let fileUploader;

  $: if (fileUploader) {
    fileUploader.clearFiles();
  }

  export function clearFiles() {
    fileUploader.clearFiles();
    fileUploadProps.status = "";
    fileUploadProps.errorSubject = "";
    fileUploadProps.errorBody = "";
    fileUploadProps.invalid = false;
    dispatch("clear");
  }

  function handleLoading() {
    fileUploadProps.status = "uploading";
    fileUploadProps.invalid = false;
    fileUploadProps.errorSubject = "";
    fileUploadProps.errorBody = "";
  }

  function handleValidityError(error) {
    fileUploadProps.status = "edit";
    fileUploadProps.invalid = true;
    fileUploadProps.errorSubject = "Error";
    fileUploadProps.errorBody = String(error).split(":")[1];
  }

  function handleGeoJsonError(data, error) {
    if (data && data.features && data.features.length) {
      fileUploadProps.errorSubject = "Warning";
      fileUploadProps.errorBody =
        "We can fetch data for this area but cannot display it on the inset map.";
      // FIXME: support this use case???
      // const location = formatFeature(geojson.features[0], "custom");
      // location.title = file.name;
      // dispatch("upload", { location });
    } else {
      fileUploadProps.errorSubject = "Error";
      fileUploadProps.errorBody =
        "Something went wrong, please contact support.";
      fileUploadProps.invalid = true;
    }
  }

  function handleGeoJsonSuccess(data) {
    if (data.type === "FeatureCollection") {
      if (data.features.length) {
        const flag = data.features.length > 1;
        fileUploadProps.status = flag ? "edit" : "complete";
        fileUploadProps.errorSubject = flag ? "Warning" : "";
        fileUploadProps.errorBody = flag
          ? "The uploaded file has more than 1 geometry. The tool can display fetch data for only 1 geometry at a time."
          : "";
        fileUploadProps.invalid = flag;
        return data.features[0];
      } else {
        fileUploadProps.status = "edit";
        fileUploadProps.invalid = true;
        fileUploadProps.errorSubject = "Error";
        fileUploadProps.errorBody = "Uploaded file contains no features.";
        return null;
      }
    } else if (data.type === "Feature") {
      fileUploadProps.errorSubject = "";
      fileUploadProps.errorBody = "";
      fileUploadProps.invalid = false;
      return data;
    } else {
      fileUploadProps.status = "edit";
      fileUploadProps.invalid = true;
      fileUploadProps.errorSubject = "Error";
      fileUploadProps.errorBody =
        "Must be a GeoJSON FeatureCollection or Feature.";
      return null;
    }
  }

  async function processUpload(file) {
    handleLoading();

    // NOTE: this only validates the file against the Cal-Adapt API.
    // The response is not used for anything.
    const [, validityError] = await handleXHR(validateShape(file));

    if (validityError) {
      handleValidityError(validityError);
      return;
    }

    // Try converting the uploaded boundary to (Geo)JSON format
    const [geojson, geojsonError] = await handle(convertFileToGeojson(file));

    if (geojsonError) {
      handleGeoJsonError(geojson, geojsonError);
      return;
    }

    if (typeof geojson === "object" && "type" in geojson) {
      const feature = handleGeoJsonSuccess(geojson);
      if (feature) {
        const location = formatFeature(feature, "custom");
        location.title = file.name;
        dispatch("upload", { location });
      } else {
        handleGeoJsonError(geojson);
      }
    } else {
      handleGeoJsonError(geojson);
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
