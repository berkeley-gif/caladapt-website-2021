<script context="module"></script>

<script>
  import {
    Button,
    Form,
    FormGroup,
    Select,
    SelectItem,
    TextArea,
    TextInput,
  } from "carbon-components-svelte";

  const selectItems = ["Option One", "Option Two", "Option Three"];

  function handleSubmit(event) {
    event.preventDefault();
    console.log(event);
  }
</script>

<style>
  .banner {
    padding: var(--spacing-48) var(--spacing-16);
    background-color: var(--gray-80);
  }
</style>

<svelte:head>
  <title>Newsletter Signup | Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<div class="bleed banner overlay">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
        <h1>Cal-Adapt Newsletter</h1>
        <p class="lead">
          Signup for quarterly updates on climate tools, data and resources on
          Cal-Adapt. Occasionally, we might send you announcements of events or
          workshops related to Cal-Adapt.
        </p>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>
  </div>
</div>

<div class="bx--grid">
  <Form on:submit="{handleSubmit}">
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-5">
        <FormGroup />
      </div>
      <div class="bx--col-lg-5">
        <FormGroup />
      </div>
      <div class="bx--col-lg-4"></div>
    </div>

    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-5">
        <FormGroup>
          <TextInput labelText="First name" required />
        </FormGroup>
      </div>
      <div class="bx--col-lg-5">
        <FormGroup>
          <TextInput labelText="Last name" required />
        </FormGroup>
      </div>
      <div class="bx--col-lg-4"></div>
    </div>

    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-5">
        <FormGroup>
          <TextInput labelText="Email address" required />
        </FormGroup>
      </div>
      <div class="bx--col-lg-5">
        <FormGroup>
          <TextInput labelText="City" required />
        </FormGroup>
      </div>
      <div class="bx--col-lg-4"></div>
    </div>

    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-5">
        <FormGroup>
          <TextInput labelText="State" required />
        </FormGroup>
      </div>
      <div class="bx--col-lg-5">
        <FormGroup>
          <TextInput labelText="Country" required />
        </FormGroup>
      </div>
      <div class="bx--col-lg-4"></div>
    </div>

    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-5">
        <FormGroup>
          <Select labelText="Profession" value="placeholder-item" required>
            <SelectItem
              disabled
              value="placeholder-item"
              text="Choose an option"
            />
            {#each selectItems as item}
              <SelectItem value="item" text="{item}" />
            {/each}
          </Select>
        </FormGroup>
      </div>
      <div class="bx--col-lg-9"></div>
    </div>

    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col--4" style="padding-left: 1rem">
        <FormGroup>
          <TextArea
            labelText="Optional message to Cal-Adapt"
            helperText=""
            placeholder=""
          />
        </FormGroup>
      </div>
      <div class="bx--col-lg-10"></div>
    </div>

    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col--4" style="padding-left: 1rem">
        <FormGroup>
          <Button type="submit">Submit</Button>
        </FormGroup>
      </div>
      <div class="bx--col-lg-10"></div>
    </div>
  </Form>
</div>

<div class="spacing--v-96"></div>
