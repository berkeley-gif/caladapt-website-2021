<script>
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Banner, SidebarRight } from "~/partials";
  import { Card, CardsContainer } from "~/components/cards";

  const cardsData = [
    {
      titleText: "Tools, How to Guide, & Data Download",
      linkPath: "/",
      description: "Description forthcoming",
      bgColor: "var(--card-gradient-01)",
    },
    {
      titleText: "Analytics Engine",
      linkPath: "https://analytics.cal-adapt.org",
      description: "Description forthcoming",
      bgColor: "var(--card-gradient-02)",
    },
    {
      titleText: "Data Development Grants",
      linkPath: "/new-homepage/#",
      description: "Description forthcoming",
      bgColor: "var(--card-gradient-03)",
    },
  ];
  const cardHeight = 18;
  const cardWidth = 18;

  const updatesLinks = [
    {
      title: "Update number one.",
      linkPath: "/new-homepage/#",
    },
    {
      title: "Update number two.",
      linkPath: "/new-homepage/#",
    },
    {
      title: "Update number three",
      linkPath: "/new-homepage/#",
    },
  ];
</script>

<svelte:head>
  <title>Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="Cal-Adapt provides a way to explore peer-reviewed data that 
    portrays how climate change might affect California at the state and local
    levels."
  subtitleText="We make this data available through downloads, visualizations, 
    and the Cal-Adapt API for your research, outreach, and adaptation planning
    needs."
  titleFontSize="2rem"
  titleFontWeight="600"
  useOffset="{false}"
  bgColor="#888"
/>

<div class="spacing--v-32"></div>

<Grid>
  <Row>
    <Column lg="{{ span: 12 }}">
      <CardsContainer gridGap="{2}" cardWidth="{cardWidth}">
        {#each cardsData as cardDatum, index}
          <Card
            {...{
              ...cardDatum,
              height: cardHeight,
              ctaText: "Learn more",
              textColor: "white",
              useRule: true,
            }}
          />
        {/each}
      </CardsContainer>
    </Column>
    <Column lg="{{ span: 3, offset: 1 }}">
      <h2 class="h4">Latest Updates</h2>
      <ul>
        {#each updatesLinks as { title, linkPath }}
          <li><a href="{linkPath}">{title}</a></li>
        {/each}
      </ul>
    </Column>
  </Row>
</Grid>

<div class="spacing--v-96"></div>
