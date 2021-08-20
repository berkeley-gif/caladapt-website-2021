<script>
  export let imgSrc = "";
</script>

<style>
  .card--image-container {
    aspect-ratio: 16 / 9;
    background-repeat: no-repeat;
    background-size: cover;
  }

  @supports not (aspect-ratio: 16 / 9) {
    .card--image-container::before {
      float: left;
      padding-top: 56.25%;
      content: "";
    }

    .card--image-container::after {
      display: block;
      content: "";
      clear: both;
    }
  }
</style>

<div
  style="background-image: url('{imgSrc}')"
  class="card--image-container"
></div>
