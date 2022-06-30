<script>
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Banner, SidebarRight } from "~/partials";
  import { Card, CardsContainer } from "~/components/cards";

  const cardsData = [
    {
      titleText: "Tools, How to Guide, & Data Download",
      linkPath: "/",
      description: `Access climate data via visualizations, downloads, and
        the Cal-Adapt API for your research, outreach, and adaptation planning
        needs.`,
      bgColor:
        "linear-gradient(180deg, #0F9699 0%, #0F9982 0.01%, #035466 100%)",
      textColor: "var(--white)",
      ctaText: "Learn More",
    },
    {
      titleText: "Cal-Adapt: Analytics Engine",
      linkPath: "https://analytics.cal-adapt.org",
      description: `Utilize cloud storage and computation to analyze Petabytes
        of stored data supported by scientific guidance.`,
      bgColor: "linear-gradient(180deg, #248DB3 0%, #096180 100%)",
      textColor: "var(--white)",
      ctaText: "Visit Site",
    },
    {
      titleText: "Data Development Grants",
      linkPath: "/new-homepage/#",
      description: "Description forthcoming.",
      bgColor: "linear-gradient(180deg, #19953E 0%, #196B5B 100%)",
      textColor: "var(--white)",
      ctaText: "Learn More",
    },
  ];
  const cardHeight = 20;
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
  titleText="Cal-Adapt provides public access to climate data that contribute to
    California’s Climate Change Assessments."
  subtitleText="Cal-Adapt provides interactive, easy-to-use visualization and
    data download tools for a broad range of stakeholders; a “pro” version for
    users with highly technical, data-intensive needs; and links to state-funded
    grants that support development of data for Cal-Adapt."
  titleFontSize="2rem"
  titleFontWeight="600"
  useOffset="{false}"
  bannerImg="linear-gradient(180deg, #003850 0%, #067C74 100%)"
  overlayOpacity="0"
/>

<div class="spacing--v-32"></div>

<Grid>
  <Row>
    <Column lg="{{ span: 12 }}">
      <CardsContainer gridGap="{2}" cardWidth="{cardWidth}">
        {#each cardsData as card, index}
          <Card
            {...{
              ...card,
              height: cardHeight,
              useRule: true,
            }}
          />
        {/each}
      </CardsContainer>
    </Column>
    <Column lg="{{ span: 3, offset: 1 }}">
      <h2 class="h4">Latest Updates</h2>
      <ul style="margin-left: 1rem">
        {#each updatesLinks as { title, linkPath }}
          <li><a href="{linkPath}">{title}</a></li>
        {/each}
      </ul>
    </Column>
  </Row>
</Grid>

<div class="spacing--v-96"></div>
