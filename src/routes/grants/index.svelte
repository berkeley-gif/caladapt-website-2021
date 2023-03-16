<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => posts);
    const events = await this.fetch(`events.json`)
      .then((r) => r.json())
      .then((events) => events);
    const data = await this.fetch("index.json")
      .then((r) => r.json())
      .then((data) => data);
    return {
      posts,
      events,
    };
  }
</script>

<script>
  import {
    Button,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import { Banner, SidebarRight } from "~/partials";

  export let events;
  export let posts;

  const memoItems = [
    {
      agency: "CEC",
      type: `memo`,
      number: "12",
      title: "A Really cool memo",
    },
    {
      agency: "CEC",
      type: `memo`,
      number: "12",
      title: "A Really cool memo",
    },
    {
      agency: "CEC",
      type: `memo`,
      number: "12",
      title: "A Really cool memo",
    },
  ];

  const researchItems = [
    {
      agency: "CEC",
      type: `memo`,
      number: "12",
      title: "A Really cool memo",
    },
    {
      agency: "CEC",
      type: `memo`,
      number: "12",
      title: "A Really cool memo",
    },
    {
      agency: "CEC",
      type: `memo`,
      number: "12",
      title: "A Really cool memo",
    },
  ];
</script>

<style>
  p:not(.lead) {
    font-size: 1.125rem;
  }

  :global(.bx--structured-list) {
    background-color: #fff;
  }
</style>

<svelte:head>
  <title>Grants - Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="Data Development Grants & Research Projects"
  bannerImg="linear-gradient(to bottom, var(--gray-90), var(--teal-70))"
  overlayColor="transparent"
  useOffset="{false}"
/>
<div class="spacing--v-32"></div>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col-lg-12 bx--col-md-8 bx--col-sm-4">
      <p>
        The California Energy Commission supports a variety of research projects
        that are helping shape the development of next generation climate data
        for California and the evolving Cal-Adapt enterprise.
      </p>

      <div class="spacing--v-24"></div>
      <h5>Relevant Memos</h5>
      <StructuredList>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Agency</StructuredListCell>
            <StructuredListCell head>Type</StructuredListCell>
            <StructuredListCell head>Number</StructuredListCell>
            <StructuredListCell head>Title</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#each memoItems as item}
            <StructuredListRow label for="row-{item.format}">
              <StructuredListCell
                >{item.agency.toUpperCase()}</StructuredListCell
              >
              <StructuredListCell>{item.type}</StructuredListCell>
              <StructuredListCell>{item.number}</StructuredListCell>
              <StructuredListCell>{item.title}</StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>

      <h5>Ongoing Climate Research</h5>
      <StructuredList>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Agency</StructuredListCell>
            <StructuredListCell head>Type</StructuredListCell>
            <StructuredListCell head>Number</StructuredListCell>
            <StructuredListCell head>Title</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#each researchItems as item}
            <StructuredListRow label for="row-{item.format}">
              <StructuredListCell
                >{item.agency.toUpperCase()}</StructuredListCell
              >
              <StructuredListCell>{item.type}</StructuredListCell>
              <StructuredListCell>{item.number}</StructuredListCell>
              <StructuredListCell>{item.title}</StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>
    </div>

    <!-- Sidebar desktop only -->
    <div class="bx--col-lg-4 bx--col-md-0 bx--col-sm-0">
      <SidebarRight
        display="{['events', 'posts']}"
        events="{events}"
        posts="{[posts[0]]}"
      />
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col">
      <div class="spacing--v-48"></div>
      <p class="lead">
        Get the latest Cal-Adapt news, updates &amp; events delivered to your
        inbox. Subscribe to the Cal-Adapt Newsletter.
      </p>
      <Button icon="{ArrowRight16}" href="/signup">SUBSCRIBE</Button>
    </div>
  </div>
</div>

<div class="spacing--v-96"></div>

<div class="spacing--v-96"></div>
