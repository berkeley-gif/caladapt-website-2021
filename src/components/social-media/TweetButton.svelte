<script>
  export let text = "The latest from Cal-Adapt";
  export let url = "https://cal-adapt.org";
  export let hashtags = [];
  export let via = "cal_adapt";
</script>

<div>
  <a
    class="twitter-share-button"
    href="https://twitter.com/intent/tweet"
    data-dnt="true"
    data-text="{text}"
    data-url="{url}"
    data-hashtags="{Array.isArray(hashtags) && hashtags.length
      ? hashtags.join(',')
      : ''}"
    data-via="{via}"
  >
    Tweet</a
  >
</div>
