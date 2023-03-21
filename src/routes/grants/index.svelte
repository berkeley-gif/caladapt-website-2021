<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => posts);
    const events = await this.fetch(`events.json`)
      .then((r) => r.json())
      .then((events) => events);
    const grants = await this.fetch(`grants.json`)
      .then((r) => r.json())
      .then((grants) => grants);
    return {
      posts,
      events,
      memosData: grants.memosData,
      researchData: grants.researchData,
    };
  }
</script>

<script>
  import {
    Button,
    Row,
    Column,
    Link,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListHead,
    StructuredListBody,
  } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import { Banner, SidebarRight } from "~/partials";

  export let events;
  export let posts;
  export let memosData;
  export let researchData;
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
  bannerImg="linear-gradient(to bottom, var(--gray-90), var(--blue-40))"
  overlayColor="transparent"
/>
<div class="spacing--v-32"></div>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8 bx--col-padding">
      <p>
        The California Energy Commission supports a variety of research projects
        that are helping shape the development of next generation climate data
        for California and the evolving Cal-Adapt enterprise.
      </p>

      <!-- Memo list -->
      <div class="spacing--v-24"></div>
      <h2>Relevant Memos</h2>
      <Row>
        <Column>
          <StructuredList style="margin-bottom:0;">
            <StructuredListHead>
              <StructuredListRow head tabIndex="{0}">
                <StructuredListCell head>Agency</StructuredListCell>
                <StructuredListCell head>Type</StructuredListCell>
                <StructuredListCell head>Number</StructuredListCell>
                <StructuredListCell head>Title</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {#each memosData as item}
                <StructuredListRow>
                  <StructuredListCell>{item.agency}</StructuredListCell>
                  <StructuredListCell>{item.type}</StructuredListCell>
                  <StructuredListCell>{item.number}</StructuredListCell>
                  <StructuredListCell
                    ><Link href="{item.url}" target="_blank">{item.title}</Link
                    ></StructuredListCell
                  >
                </StructuredListRow>
              {/each}
            </StructuredListBody>
          </StructuredList>
        </Column>
      </Row>

      <div class="spacing--v-32"></div>
      <!-- Climate Research list -->
      <h2>Ongoing Climate Research</h2>
      <Row>
        <Column>
          <StructuredList style="margin-bottom:0;">
            <StructuredListHead>
              <StructuredListRow head tabIndex="{0}">
                <StructuredListCell head>Agency</StructuredListCell>
                <StructuredListCell head>Type</StructuredListCell>
                <StructuredListCell head>Number</StructuredListCell>
                <StructuredListCell head>Title</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {#each researchData as item}
                <StructuredListRow>
                  <StructuredListCell>{item.agency}</StructuredListCell>
                  <StructuredListCell>{item.type}</StructuredListCell>
                  <StructuredListCell>{item.number}</StructuredListCell>
                  <StructuredListCell
                    ><Link href="{item.url}" target="_blank">{item.title}</Link
                    ></StructuredListCell
                  >
                </StructuredListRow>
              {/each}
            </StructuredListBody>
          </StructuredList>
        </Column>
      </Row>
    </div>

    <!-- Sidebar desktop only -->
    <div class="bx--offset-lg-1 bx--col-lg-5 bx--col-padding">
      <SidebarRight
        display="{['events', 'posts']}"
        events="{events}"
        posts="{[posts[0]]}"
      />
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col">
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
