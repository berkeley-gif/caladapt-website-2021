<script>
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Banner, SidebarRight } from "~/partials";
  import { Card, CardsContainer } from "~/components/cards";

  const dummyLink = "/homepage-redesign-preview/#";

  const cardsData = [
    {
      titleText: "Tools, How to Guide, & Data Download",
      linkPath: "/",
      description: `Access climate data via visualizations, downloads, and
        the Cal-Adapt API for your research, outreach, and adaptation planning
        needs.`,
      bgColor:
        "linear-gradient(180deg, #0F9699 0%, #0F9982 0.01%, #035466 100%)",
      ctaText: "Learn More",
    },
    {
      titleText: "Cal-Adapt: Analytics Engine",
      linkPath: "https://analytics.cal-adapt.org",
      description: `Utilize cloud storage and computation to analyze Petabytes
        of stored data supported by scientific guidance.`,
      bgColor: "linear-gradient(180deg, #248DB3 0%, #096180 100%)",
      ctaText: "Visit Site",
    },
    {
      titleText: "Data Development Grants",
      linkPath: dummyLink,
      description: "Description forthcoming.",
      bgColor: "linear-gradient(180deg, #19953E 0%, #196B5B 100%)",
      ctaText: "Learn More",
    },
  ];
  const cardHeight = 20;
  const cardWidth = 18;

  const updateLinksPlaceholders = [
    {
      title: "Update number one",
      linkPath: dummyLink,
    },
    {
      title: "Update number two",
      linkPath: dummyLink,
    },
    {
      title: "Update number three",
      linkPath: dummyLink,
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
        {#each cardsData as card}
          <Card
            {...{
              ...card,
              height: cardHeight,
              useRule: true,
              textColor: "var(--white)",
            }}
          />
        {/each}
      </CardsContainer>
    </Column>

    <Column lg="{{ span: 3, offset: 1 }}">
      <h2 class="h4">Latest Updates</h2>
      <p>
        Learn more about the latest changes and improvements to Cal-Adapt on our
        blog.
      </p>
      <ul style="margin-left: 1rem">
        {#each updateLinksPlaceholders as { title, linkPath }}
          <li><a href="{linkPath}">{title}</a></li>
        {/each}
      </ul>
    </Column>
  </Row>
</Grid>

<div class="spacing--v-96"></div>
