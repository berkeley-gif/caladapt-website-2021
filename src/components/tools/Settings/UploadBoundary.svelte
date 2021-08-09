<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { FileUploader } from "carbon-components-svelte";
  import calculateArea from "@turf/area";
  import { convertArea } from "@turf/helpers";

  // Helpers
  import {
    handleXHR,
    handle,
    convertFileToGeojson,
    validateShape,
  } from "./../../../helpers/utilities";
  import { formatBoundaryPolygon } from "./../../../helpers/geocode";

  export let open = false;

  let ready = false;
  let fileUploader;
  const fileUploadProps = {
    labelTitle: "Upload Boundary",
    labelDescription: "Supported formats - zipped shapefile, GeoJSON, KML, WKT",
    buttonLabel: "Select file",
    accept: [".zip", ".json", ".kml", ".wkt"],
    id: "Upload",
  };

  $: if (open) {
    fileUploader.clearFiles();
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
    if (geojsonError) {
      fileUploadProps.errorSubject = "Warning";
      fileUploadProps.errorBody =
        "Unable to display shape on map. File is valid and will be used to display spatially aggregated data.";
    }
    const { features } = geojson;
    if (features.length > 1) {
      fileUploadProps.status = "edit";
      fileUploadProps.invalid = true;
      fileUploadProps.errorSubject = "Error";
      fileUploadProps.errorBody = "The uploaded file has more than 1 polygons";
    }
    console.log("feature", features);
    const location = formatBoundaryPolygon(features[0], "custom");
    location.title = file.name;
    dispatch("upload", { location });
    return;
  }

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
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
  bind:this="{fileUploader}"
  on:add="{({ detail }) => {
    processUpload(detail[0]);
  }}"
/>
