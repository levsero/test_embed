# Embeddable Framework [![Build Status](https://github.com/zendesk/embeddable_framework/workflows/repo-checks/badge.svg)](https://github.com/zendesk/embeddable_framework/workflows/repo-checks/badge.svg)[![FOSSA Status](https://app.fossa.io/api/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git.svg?type=shield)](https://app.fossa.io/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git?ref=badge_shield)

## Description

A 3rd party embeddable framework that handles bringing Zendesk outside of the agent view and onto 3rd party websites.

## Owners

This repository is maintained by [Team Taipan](https://zendesk.atlassian.net/wiki/pages/viewpage.action?pageId=86114732). You can get in touch with us via:

- Email **taipan@zendesk.com**
- Slack **#taipan-team** channel
- Mention **@zendesk/taipan** on Github
- [Taipan JIRA Sprint Board](https://zendesk.atlassian.net/jira/software/projects/EWW/boards/1270)
- [Taipan JIRA Backlog](https://zendesk.atlassian.net/jira/software/projects/EWW/boards/1270/backlog)

We are based in Melbourne, Australia and our timezone is **GMT+10**. You can always check the [time](http://time.is/Melbourne) in Melbourne.

## Getting Started

### Prerequisites

Please see the [README](/README.md) in the repo root for instructions on getting everything installed and setup

### Running in dev mode

#### Developer dashboard

The recommended way to develop on the embeddable framework is with the developer dashboard as it provides things like UI controls to control settings and feature flags as well as many other features.

To use the dashboard, follow the steps in the [widget developer dashboard repo](https://github.com/zendesk/widget-developer-dashboard)

This repo and the dashboard repo need to be in your `Code/zendesk` folder.

Once the developer dashboard repo is cloned and setup, run it from this project with the command

```sh
yarn workspace @zendesk/embeddable-framework dashboard
```

The developer dashboard will be available at (http://localhost:1338)[http://localhost:1338].

#### Dev templates

A light-weight alternative to the developer dashboard is with the templates found in `packages/framework/dev/templates/web_widget`.

To access them, first create a config file with the script

```bash
./script/create-dev-config
```

This will save a config file to `packages/framework/dev/configs` (the developer dashboard utilities the same configs).

Or manually copy the example config and fill out the values yourself

```bash
cp dev/configs/example-template.js dev/configs/${yourUserConfigName}.js
```

Inside the templates folder will be a bunch of `.html.example` files, to generate the actual html files from this, run the command

```bash
script/setup_html_templates.rb
```

Then run the framework in dev mode with the config provided via the environment variable `USER_CONFIG`

```bash
USER_CONFIG={yourConfigName} yarn workspace @zendesk/embeddable-framework dev
```

The templates written in `packages/framework/dev/templates/web_widget` will then be available at http://localhost:1337/templateName.html

If you encounter a `Cannot GET /live.html` error after loading, you may need to re-run command to setup the html templates.

## Testing

- Unit and integration tests use React Testing Library and are run via Jest. For more information, please
  read our [Test Style Guide](./TEST_STYLE.md).

- We use puppeteer to run our E2E and visual regression tests. For more information, please read our [Browser Test Style Guide](./BROWSER_TEST_STYLE.md).

## Running in Docker

(Note that this isn't part of Taipan's usual workflow.)

- Follow above to get `yarn workspace @zendesk/embeddable-framework dev` running.
- Run `zdi embeddable_framework -d restart` in parallel.

### Building Docker image

- Run `yarn build` to build static assets inside `./dist/public`.
- Run `zdi embeddable_framework build`.
- Verify the built image with `zdi embeddable_framework restart -l`.
- To push, run `zdi embeddable_framework release --official`.

## Contribute

If you would like to submit a PR to our repo, please read our [contribution guidelines](CONTRIBUTING.md) first.

## Deploying

Please see our [Deploy guidelines](https://github.com/zendesk/embeddable_framework/blob/master/DEPLOY.md) for more information.

## Bugs

Please inform us of any bugs that you have to report in our #taipan-team Slack channel and tag your comment with @taipan-firefighter.

## Refreshing Rosetta translations

To download the latest translations, run the following command from the root of this project:

```bash
./script/fetch_i18n
```

## Refreshing countries translations from CLDR

To download the latest translations, run the following command from the root of this project:

```bash
./script/fetch_countries
```

## Debugging customer issues

Sometimes we have issues that only manifest on customers sites.

### Viewing Redux logs

To see redux logging information on their site we can add a value to localstorage to surface the debug logs.

Go to the customer's site, open a browser console and run the following command:

```js
localStorage['ZD-debug'] = true
```

After that when you refresh the page you will start seeing redux logs in your console and redux devtools if you have the [browser extension](https://github.com/zalmoxisus/redux-devtools-extension) installed.

## Documenting APIs

See <a href="https://zendesk.atlassian.net/wiki/spaces/DOC/pages/641704628/How+developer+docs+are+produced+at+Zendesk" target="_blank">How developer docs are produced at Zendesk</a> on the Docs team wiki.

Please cc **@zendesk/documentation** on any PR that adds or updates documentation on the developer portal at [https://developer.zendesk.com](https://developer.zendesk.com).

## Contribute

If you would like to submit a PR to our repo, please read our [contribution guidelines](CONTRIBUTING.md) first.

## Deploying

Please see our [Deploy guidelines](https://github.com/zendesk/embeddable_framework/blob/master/DEPLOY.md) for more information.
