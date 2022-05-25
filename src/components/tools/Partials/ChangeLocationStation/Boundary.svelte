<script>
  import { SelectBoundary, UploadBoundary } from "~/components/tools/Settings";

  export let currentBoundary = null;
  export let boundaryList = [];
  export let addStateBoundary = false;
  export let enableUpload = false;

  let uploadBoundaryRef = null;
  let uploadBoundaryFiles = [];

  // Reset the UploadBoundary component state when opening / closing or
  // when selecting a different boundary type.
  $: currentBoundary, maybeClearUploadBoundary();

  function maybeClearUploadBoundary() {
    if (
      uploadBoundaryRef &&
      uploadBoundaryFiles.length &&
      currentBoundary &&
      currentBoundary.id !== "custom"
    ) {
      uploadBoundaryRef.clearFiles();
    }
  }
</script>

<style>
  div {
    margin: 1.5rem 0;
    max-width: 75%;
  }
</style>

<div>
  <SelectBoundary
    on:change
    selectedId="{currentBoundary.id}"
    items="{boundaryList}"
    addStateBoundary="{addStateBoundary}"
  />
  {#if enableUpload}
    <UploadBoundary
      bind:this="{uploadBoundaryRef}"
      bind:files="{uploadBoundaryFiles}"
      on:upload
      on:clear
    />
  {/if}
</div>
