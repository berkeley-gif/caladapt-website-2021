<script>
  import {
    Row,
    Column,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from 'carbon-components-svelte';
  import { timeFormat, utcParse } from 'd3-time-format';
  import { stores } from '@sapper/app';

  export let items;
  const dateParse = utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
  const dateFormat = timeFormat('%B %d, %Y');
  const { page } = stores();
  $: slug = $page.params.category;
</script>

{#if slug === 'tutorials'}
  <Row>
    <Column>
      <StructuredList style="margin-bottom:0;">
        <StructuredListBody>
          {#each items as item}
            <StructuredListRow>
              <StructuredListCell style="text-transform:uppercase;font-weight:600;">
                {item.metadata.category}
              </StructuredListCell>
              <StructuredListCell>
                {dateFormat(dateParse(item.metadata.date))}
              </StructuredListCell>
              <StructuredListCell>
                <a
                  style="font-size:1rem;"
                  href={item.metadata.video}
                  rel="prefetch">
                  {item.metadata.title}
                </a>
                { @html item.html }
              </StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>
    </Column>
  </Row>
{:else}
  <Row>
    <Column>
      <StructuredList style="margin-bottom:0;">
        <StructuredListBody>
          {#each items as item}
            <StructuredListRow>
              <StructuredListCell>
                 <a
                  style="font-size:1rem;"
                  href={`/help/${slug}/${item.slug}/`}
                  rel="prefetch">
                  {item.metadata.title}
                </a>
              </StructuredListCell>
            </StructuredListRow>
          {/each}

        </StructuredListBody>
      </StructuredList>
    </Column>
  </Row>
{/if}