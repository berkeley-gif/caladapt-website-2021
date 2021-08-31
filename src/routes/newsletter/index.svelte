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

  console.log(process.env.NODE_ENV);

  // TODO: add real values for profession select
  const selectItems = ["Option One", "Option Two", "Option Three"];

  const defaultValues =
    process.env.NODE_ENV === "development"
      ? {
          name: "Chris",
          name_last: "Henrick",
          email: "chrishenrick@gmail.com",
          company: "",
          city: "Oak",
          state: "CA",
          country: "United States",
          profession: "Option A",
        }
      : {
          name: "",
          name_last: "",
          email: "",
          company: "",
          city: "",
          state: "",
          country: "",
          profession: "",
        };

  $: formSuccess = false;
  $: formError = true;

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    try {
      const res = await window.fetch(
        "https://landing.mailerlite.com/webforms/landing/z3u0j0",
        {
          method: "post",
          body: JSON.stringify(formProps),
        }
      );
      formSuccess = true;
    } catch (error) {
      console.error(error);
      formError = true;
    }
  }

  function resetFormState() {
    formSuccess = false;
    formError = false;
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

<div class="spacing--v-32"></div>

<div class="bx--grid">
  {#if formSuccess}
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-6">
        <p>Thank you! You have successfully signed up for our newsletter.</p>
        <p>Please make sure to confirm your email.</p>
      </div>
      <div class="bx--col-lg-8"></div>
    </div>
  {:else if formError}
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-6">
        <p>
          We're sorry, but the form did not submit correctly. Please try again
          or email <a href="mailto:support@cal-adapt.org"
            >support@cal-adapt.org</a
          > for help.
        </p>
        <Button on:click="{resetFormState}">Try Again</Button>
      </div>
      <div class="bx--col-lg-8"></div>
    </div>
  {:else}
    <Form
      on:submit="{handleSubmit}"
      action="https://landing.mailerlite.com/webforms/landing/z3u0j0"
      data-id="549651"
      data-code="z3u0j0"
      method="POST"
    >
      <div class="bx--row">
        <div class="bx--col-lg-2"></div>
        <div class="bx--col-lg-5">
          <FormGroup>
            <TextInput
              labelText="First name"
              name="fields[name]"
              value="{defaultValues.name}"
              required
            />
          </FormGroup>
        </div>
        <div class="bx--col-lg-5">
          <FormGroup>
            <TextInput
              labelText="Last name"
              name="fields[last_name]"
              value="{defaultValues.name_last}"
              required
            />
          </FormGroup>
        </div>
        <div class="bx--col-lg-4"></div>
      </div>

      <div class="bx--row">
        <div class="bx--col-lg-2"></div>
        <div class="bx--col-lg-5">
          <FormGroup>
            <TextInput
              labelText="Company"
              name="fields[company]"
              value="{defaultValues.company}"
            />
          </FormGroup>
        </div>
        <div class="bx--col-lg-5">
          <FormGroup>
            <TextInput
              labelText="Email address"
              type="email"
              name="fields[email]"
              value="{defaultValues.email}"
              required
            />
          </FormGroup>
        </div>
        <div class="bx--col-lg-4"></div>
      </div>

      <div class="bx--row">
        <div class="bx--col-lg-2"></div>
        <div class="bx--col-lg-5">
          <FormGroup>
            <TextInput
              labelText="City"
              name="fields[city]"
              value="{defaultValues.city}"
              required
            />
          </FormGroup>
        </div>
        <div class="bx--col-lg-5">
          <FormGroup>
            <TextInput
              labelText="State"
              name="fields[state]"
              value="{defaultValues.state}"
              required
            />
          </FormGroup>
        </div>
        <div class="bx--col-lg-4"></div>
      </div>

      <div class="bx--row">
        <div class="bx--col-lg-2"></div>
        <div class="bx--col-lg-5">
          <FormGroup>
            <TextInput
              labelText="Country"
              name="fields[country]"
              value="{defaultValues.country}"
              required
            />
          </FormGroup>
        </div>
        <div class="bx--col-lg-10"></div>
      </div>

      <div class="bx--row">
        <div class="bx--col-lg-2"></div>
        <div class="bx--col-lg-5">
          <FormGroup>
            <Select
              labelText="Profession"
              value="{defaultValues.profession}"
              name="fields[profession]"
              required
            >
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
              name="fields[message]"
              helperText=""
              placeholder=""
            />
          </FormGroup>
        </div>
        <div class="bx--col-lg-10"></div>
      </div>

      <div class="bx--row">
        <div class="bx--col-lg-2"></div>
        <div class="bx--col--4" style="padding-left: 1rem;">
          <FormGroup>
            <Button style="text-transform: uppercase" type="submit"
              >Submit</Button
            >
          </FormGroup>
        </div>
        <div class="bx--col-lg-10"></div>
      </div>
    </Form>
  {/if}
</div>

<div class="spacing--v-96"></div>
