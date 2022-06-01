<script>
  import { createEventDispatcher } from "svelte";
  import { FileUploader } from "carbon-components-svelte";
  import bbox from "@turf/bbox";

  // Helpers
  import {
    handleXHR,
    handle,
    convertFileToGeojson,
    validateShape,
  } from "~/helpers/utilities";
  import { formatFeature } from "~/helpers/geocode";

  /** the files attribute from the file input  */
  export let files = [];

  const dispatch = createEventDispatcher();

  const labelDescription = `Select a boundary from the dropdown list or upload
    your project area. Supported formats - zipped Shapefile, GeoJSON, KML.`;

  const statuses = {
    uploading: "uploading",
    edit: "edit",
    complete: "complete",
  };

  const fileUploadProps = {
    labelTitle: "",
    labelDescription,
    buttonLabel: "Upload File",
    accept: [".zip", ".json", ".geojson", ".kml"],
    iconDescription: "Clear file",
    id: "upload-custom-boundary",
    errorSubject: "", // not actually a FileUploader prop
    errorBody: "", // not actually a FileUploader prop
    status: statuses.uploading,
  };

  // ref to FileLoader component
  let ref;

  export function clearFiles() {
    ref.clearFiles();
    fileUploadProps.status = statuses.uploading;
    fileUploadProps.errorSubject = "";
    fileUploadProps.errorBody = "";
    fileUploadProps.invalid = false;
    dispatch("clear");
  }

  function handleLoading() {
    fileUploadProps.status = statuses.uploading;
    fileUploadProps.invalid = false;
    fileUploadProps.errorSubject = "";
    fileUploadProps.errorBody = "";
  }

  /** @type {(error: Error | string, title: "Error" | "Warning") => void} */
  function handleValidityError(error, title = "Error") {
    fileUploadProps.status = statuses.edit;
    fileUploadProps.invalid = title === "Error";
    fileUploadProps.errorSubject = title;
    fileUploadProps.errorBody =
      typeof error === "object" ? error.message : error;
  }

  /** @type {(data: GeoJSON) => Feature | null } */
  function handleGeoJsonSuccess(data) {
    if (data.type === "FeatureCollection") {
      if (data.features.length) {
        const flag = data.features.length > 1;
        fileUploadProps.status = statuses.complete;
        fileUploadProps.errorSubject = flag ? "Warning" : "";
        fileUploadProps.errorBody = flag
          ? `The uploaded file has more than 1 geometry. The tool can display
            data for only 1 geometry at a time.`
          : "";
        fileUploadProps.invalid = false;
        return data.features[0];
      } else {
        handleValidityError("The uploaded file contains no features.");
        return null;
      }
    } else if (data.type === "Feature") {
      fileUploadProps.status = statuses.complete;
      fileUploadProps.errorSubject = "";
      fileUploadProps.errorBody = "";
      fileUploadProps.invalid = false;
      return data;
    } else {
      handleValidityError("Must be a GeoJSON FeatureCollection or Feature.");
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

    // Try converting the uploaded boundary to JSON format (if it's not already)
    const [geojson, geojsonError] = await handle(convertFileToGeojson(file));
    const isValid = isValidGeoJson(geojson);

    if (geojsonError) {
      if (isValid) {
        handleValidityError(
          `We can fetch data for this area, but the boundary may not display on
          the location map.`,
          "Warning"
        );
        // NOTE: we don't early return here so that the custom boundary may still be used
      } else {
        handleValidityError(geojsonError);
        return;
      }
    }

    if (isValid) {
      const feature = handleGeoJsonSuccess(geojson);
      if (feature) {
        const location = formatFeature(feature, "custom");
        location.title = file.name;
        dispatch("upload", { location });
      }
    } else {
      handleValidityError(`Uploaded data must be in WGS84.`);
    }
  }

  function isValidGeoJson(geojson) {
    if (typeof geojson === "object" && "type" in geojson) {
      try {
        return isWgs84(geojson);
      } catch (error) {
        console.log(error);
      }
    }
    return false;
  }

  function isWgs84(data) {
    const [xMin, yMin, xMax, yMax] = bbox(data);
    if (xMin < -180 || xMax > 180) {
      return false;
    }
    if (yMin < -90 || yMax > 90) {
      return false;
    }
    return true;
  }
</script>

<style>
  div :global(.bx--file__selected-file) {
    background: #f1f4f8;
  }

  div :global(.bx--file__selected-file .bx--file-filename) {
    margin-bottom: 0;
  }
</style>

<div>
  <FileUploader
    {...fileUploadProps}
    kind="tertiary"
    bind:this="{ref}"
    bind:files
    on:add="{({ detail }) => {
      processUpload(detail[0]);
    }}"
    on:click="{clearFiles}"
  />

  {#if fileUploadProps.errorSubject || fileUploadProps.errorBody}
    <span
      >{`${fileUploadProps.errorSubject}: ` || ""}{fileUploadProps.errorBody ||
        ""}</span
    >
  {/if}
</div>
