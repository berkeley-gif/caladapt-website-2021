# Cal-Adapt Website 2021

Source code for the 2021 redesign of [cal-adapt.org](https://cal-adapt.org).

This project was bootstrapped with the [Sapper framework](https://sapper.svelte.dev/) for [SvelteJS](https://svelte.dev).

## Running the project

Once you have cloned the project, install dependencies and run the project in development mode:

```bash
cd cal-adapt-website-2021
npm install # or yarn
npm run dev
```

The project should be viewable in your browser at `http://localhost:3000`.

## Deploying

First, make the [`deploy`](./scripts/deploy.mjs) script is executable in your environment:

```bash
# on unix systems:
chmod +x scripts/deploy.mjs
```

Then run the appropriate deploy script for the environment on which you would like to deploy to:

```bash
# e.g. for dev.cal-adapt.org
npm run deploy-dev
```

This will first run `sapper export` and then transfer the output to the appropriate location on the Cal-Adapt webserver.

### Viewing the build locally prior to deploying

If you would like to view the build locally prior to deploying, first create the build without transfering it to the server:

```bash
npm run deploy-dev -- --transfer=false
```

Then run a local server that will serve the contents of `__sapper__/export`:

```bash
npm run start:export
```

You may then view the built site on `http://localhost:5000`.

This can be useful when debugging issues for the production environment.

## Running Tests

### Unit Tests

Unit tests are run using [Jest](https://www.npmjs.com/package/jest) and [@testing-library/svelte](https://www.npmjs.com/package/@testing-library/svelte).

To run all tests:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

To run tests for a specific file:

```bash
npm run test -- <pattern>
```

...where `<pattern>` is a regex for a specific file or test name.

For help on writing tests for Svelte components see the following resources:

- [Svelte Society: Unit Testing Svelte Components](https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-component/)
- [@testing-library docs](https://testing-library.com/docs/)
- [jest docs](https://jestjs.io/docs/getting-started)

## Feature Flags

The [`featureFlags`](./featureFlags.json) JSON document contains environment variables that are used to enable or disable various features or routes of the website. For client-side code these varaibles are accessible under `process.env` and in server side code (e.g. Sapper's preloading) they are accessible under `process.cal_adapt_features`. They differ due to how `process.env` is handled by browser (client) and NodeJS (server side) environments with Webpack.

Note that the values of feature flags will differ depending on the deploy environment that is set when deploying the app (e.g. the location being deployed to such as `dev.cal-adapt.org`, `beta.cal-adapt.org`, or `cal-adapt.org`). The [deploy script](./scripts/deploy.mjs) sets an environment variable `DEPLOY` which is used in the [`webpack.config.js`](./webpack.config.js) to set the values of feature flags. During local development the value of the `DEPLOY` env variable will fallback to `dev` (the same as deploying to `dev.cal-adapt.org`).

## Bundle Analyzer

To inspect the bundled JavaScript code first run the `dev` script:

```bash
npm run dev
```

Then open your browser to `http://127.0.0.1:8888` or whatever address is outputted by Webpack Bundle Analyzer in the terminal.

## Directory structure

### src

The [src](src) directory contains the entry points for the app — `client.js`, `server.js` and (optionally) a `service-worker.js` — along with a `template.html` file and a `routes` directory.

#### src/routes

This is the heart of the app. There are two kinds of routes — _pages_, and _server routes_.

**Pages** are Svelte components written in `.svelte` files. When a user first visits the application, they will be served a server-rendered version of the route in question, plus some JavaScript that 'hydrates' the page and initialises a client-side router. From that point forward, navigating to other pages is handled entirely on the client for a fast, app-like feel. (Sapper will preload and cache the code for these subsequent pages, so that navigation is instantaneous.)

**Server routes** are modules written in `.js` files, that export functions corresponding to HTTP methods. Each function receives Express `request` and `response` objects as arguments, plus a `next` function. This is useful for creating a JSON API, for example.

There are three simple rules for naming the files that define your routes:

- A file called `src/routes/about.svelte` corresponds to the `/about` route. A file called `src/routes/blog/[slug].svelte` corresponds to the `/blog/:slug` route, in which case `params.slug` is available to the route
- The file `src/routes/index.svelte` (or `src/routes/index.js`) corresponds to the root of your app. `src/routes/about/index.svelte` is treated the same as `src/routes/about.svelte`.
- Files and directories with a leading underscore do _not_ create routes. This allows you to colocate helper modules and components with the routes that depend on them — for example you could have a file called `src/routes/_helpers/datetime.js` and it would _not_ create a `/_helpers/datetime` route.

#### src/node_modules/@sapper

This directory is managed by Sapper and generated when building. It contains all the code you import from `@sapper` modules.

### static

The [static](static) directory contains static assets that should be served publicly. Files in this directory will be available directly under the root URL, e.g. an `image.jpg` will be available as `/image.jpg`.

The default [service-worker.js](src/service-worker.js) will preload and cache these files, by retrieving a list of `files` from the generated manifest:

```js
import { files } from "@sapper/service-worker";
```

If you have static files you do not want to cache, you should exclude them from this list after importing it (and before passing it to `cache.addAll`).

Static files are served using [sirv](https://github.com/lukeed/sirv).

## Bundler configuration

Webpack is used to provide code-splitting and dynamic imports, as well as compiling Svelte components.

## Using external components

When using Svelte components installed from npm, such as [@sveltejs/svelte-virtual-list](https://github.com/sveltejs/svelte-virtual-list), Svelte needs the original component source (rather than any precompiled JavaScript that ships with the component). This allows the component to be rendered server-side, and also keeps your client-side app smaller.

Because of that, it's essential that the bundler doesn't treat the package as an _external dependency_. Install the package to `devDependencies` rather than `dependencies`, which will cause it to get bundled (and therefore compiled) with your app:

```bash
npm install -D @sveltejs/svelte-virtual-list
```

## Code Credits

This project began as a [Svelte Sapper template](https://github.com/sveltejs/sapper-template) and borrows some code from both the [Svelte](https://svelte.dev/docs) and [Sapper](https://sapper.svelte.dev/docs) documentation, both of which are copyright 2016 – present, [Svelte](https://github.com/sveltejs/svelte/graphs/contributors) and [Sapper](https://github.com/sveltejs/sapper/graphs/contributors) contributors under the MIT License.

Some code relating to [Charting components](./src/components/tools/Charts/) for the dashboards has been borrowed from the [Svelte Layer Cake library](https://layercake.graphics), copyright 2021 Michael Keller under the MIT License.

Some code relating to the [Map Legend component](./src/components/tools/Map/Legend.svelte) was borrowed from the ObservableHQ [Color-Legend](https://observablehq.com/@d3/color-legend) developed by Mike Bostock, copyright 2019–2020 Observable, Inc. under the ISC License.
