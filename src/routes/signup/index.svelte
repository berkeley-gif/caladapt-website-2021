<script context="module"></script>

<script>
  import {
    Button,
    Form,
    FormGroup,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";
  import { serialize } from "~/helpers/utilities";
  import { Banner } from "~/partials";

  const selectItems = [
    "Municipal Government",
    "County Government",
    "State Government",
    "Other Government",
    "Non-profit",
    "Educator",
    "Student",
    "Private Sector",
    "Retired",
    "Other",
  ];

  const defaultValues =
    process.env.NODE_ENV !== "production"
      ? {
          name: "Johnny",
          name_last: "Appleseed",
          email: "ja@example.com",
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
  $: formError = false;

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    try {
      const res = await window.fetch(
        `https://static.mailerlite.com/webforms/submit/z3u0j0?${serialize({
          ...formProps,
          // extra stuff that seems to be required by mailerlite for the submit to work correctly
          "ml-submit": 1,
          ajax: 1,
          callback: "jQuery18309354418696922607_1630447952611",
          guid: "2e6f8bb7-0d9a-43fc-e788-ff8996b70ffb",
          _: 1630448321658,
        })}`
      );

      if (res && res.ok) {
        formSuccess = true;
      } else {
        formError = true;
      }
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
  .bx--grid :global(.bx--label),
  .bx--grid :global(.bx--text-input),
  .bx--grid :global(.bx--select-input) {
    font-size: 1rem;
  }
</style>

<svelte:head>
  <title>Newsletter Signup | Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="Cal-Adapt Newsletter"
  subtitleText="Signup for quarterly updates on climate tools, data and 
    resources on Cal-Adapt. Occasionally, we might send you announcements of 
    events or workshops related to Cal-Adapt."
/>

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
    <Form on:submit="{handleSubmit}">
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
              labelText="Company / Organization"
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
              <SelectItem text="Choose a profession" />
              {#each selectItems as item}
                <SelectItem value="{item}" text="{item}" />
              {/each}
            </Select>
          </FormGroup>
        </div>
        <div class="bx--col-lg-9"></div>
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
