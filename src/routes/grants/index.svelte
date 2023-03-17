<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => posts);
    const events = await this.fetch(`events.json`)
      .then((r) => r.json())
      .then((events) => events);
    return {
      posts,
      events,
    };
  }

  import memosList from "../../../content/grants/memos";
  import researchList from "../../../content/grants/research";
</script>

<script>
  import {
    Button,
    Row,
    Column,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import { Banner, SidebarRight } from "~/partials";

  export let events;
  export let posts;
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
      <h5>Relevant Memos</h5>
      <Row>
        <Column>
          <StructuredList style="margin-bottom:0;">
            <StructuredListBody>
              {#each memosList as item}
                <StructuredListRow>
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
        </Column>
      </Row>

      <!-- Climate Research list -->
      <h5>Ongoing Climate Research</h5>
      <Row>
        <Column>
          <StructuredList style="margin-bottom:0;">
            <StructuredListBody>
              {#each researchList as item}
                <StructuredListRow>
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
