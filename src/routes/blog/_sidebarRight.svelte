<script>
  import { createEventDispatcher } from 'svelte';
  import { Search, Select, SelectItem } from "carbon-components-svelte";

  const dispatch = createEventDispatcher();
  let options = ['data', 'tools', 'other'];


  function updateSearch(e) {
    dispatch('search', e.target.value);
  }

  function updateFilter(e) {
    dispatch('filter', e.detail);
  }

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
</script>

<div class="is-sticky">
  <!-- Events -->
  <h6>Upcoming Events</h6>
  <div style="margin-top: 1rem;">
    <div class="events">
      <ul class="event-list">
        <li class="event-list-item">
          <div class="event-date">
            <span class="month">Mar</span>
            <span class="date">11</span>
            <span class="day">Thursday</span>
          </div>
          <div class="event-details">
            <p>
              <a class="title" href="/blog/events/">Introducing the Local Climate Change Snapshot Tool</a>
            </p>
          </div>
        </li>
        <li class="event-list-item">
          <div class="event-date">
            <span class="month">Mar</span>
            <span class="date">11</span>
            <span class="day">Thursday</span>
          </div>
          <div class="event-details">
            <p>
              <a class="title" href="/blog/events/">Introducing the Local Climate Change Snapshot Tool</a>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <a href="/blog/events">See All Events</a>
  </div>

  <h6 style="margin-top: 2rem;">Filters</h6>
  <!-- Search -->
  <Search
   style="padding-left: 1.5rem;"
   on:change={updateSearch}
   on:clear={() => dispatch('search', '')} />

  <!-- Filters -->
  <div style="margin-top: 1rem;">
    <Select
     labelText="TOPICS"
     selected=""
     on:change={updateFilter}>
      <SelectItem value="" text="All Topics" />
      {#each options as opt}
        <SelectItem value={opt} text={capitalize(opt)} />
      {/each}
    </Select>
  </div>

  <!-- Help -->
  <h6 style="margin-top: 2rem;">More on Cal-Adapt</h6>
  <div style="margin-top: 1rem;">
    <ul>
      <li>
        <a href="/help/faqs/">Frequently Asked Questions</a>
      </li>
      <li>
        <a href="/help/tutorials/">Tutorials & Webinars</a>
      </li>
    </ul>
  </div>

</div>



