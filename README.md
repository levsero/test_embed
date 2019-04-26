# Embeddable Framework [![Build Status](https://travis-ci.com/zendesk/embeddable_framework.svg?token=qxD282ay7Y6ibWdkzBiB&branch=master)](https://travis-ci.com/zendesk/embeddable_framework)[![FOSSA Status](https://app.fossa.io/api/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git.svg?type=shield)](https://app.fossa.io/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git?ref=badge_shield)

## Description
A 3rd party embeddable framework that handles bringing Zendesk outside of the agent view and onto 3rd party websites.

## Owners
This repository is maintained by [Team Taipan](https://zendesk.atlassian.net/wiki/pages/viewpage.action?pageId=86114732). You can get in touch with us via:
* Email **taipan@zendesk.com**
* Slack **#taipan-team** channel
* Mention **@zendesk/taipan** on Github

We are based in Melbourne, Australia and our timezone is **GMT+10**. You can always check the [time](http://time.is/Melbourne) in Melbourne.

## Getting Started

### Run the bootstrap script
Run the following commands inside this folder:

```bash
./script/bootstrap
```

The bootstrap file will do the following:

* Run `./script/setup_node_env` to install the correct versions of nvm, node, and npm, as well as all npm dependencies.
* Run `bundle install` to get ruby dependencies
* Run `npm run build` to generate snippet, framework and example files
* Download rosetta translation and mappings into `src/translation/ze_translations.js` and `src/translation/ze_localeIdMap.js`
* Download countries translation into `src/translation/ze_countries.js`

To run the embeddables locally type `npm run dev` in this folder for it to kick off. This will build all the files required to load the Web Widget and generates some example html files where you can run the framework loaded via our snippet. Visit [http://localhost:1337/live.html](http://localhost:1337/live.html) to test the Web Widget live.

We recommended installing the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) extension on your browser.

#### Keeping node and npm packages up to date
You can safely run the `./script/setup_node_env` script at any time, even on top of an existing install.

The `./script/setup_node_env` script will ensure that all Dev team members are using the exact same versions of node, npm and npm packages defined in our lock file. We would prefer people to use this script where possible to avoid local environment differences from updating our `package-lock.json` file unnecessarily.

```bash
./script/setup_node_env
```

#### Setting up your own test values

To use your own values in the dev task you can create a new user config file in dev/configs.

```bash
cp dev/configs/example-template.json dev/configs/${yourUserConfigName}.json
```

The example template contains the following values:
```js
{
  "zendeskHost": "dev.zd-dev.com",
  "zopimId": "2EkTn0An31opxOLXuGgRCy5nPnSNmpe6",
  "talkIntegration": "https://talkintegration-pod999.zendesk-staging.com",
  "talkNickname": "hola",
  "sharedSecret": "abc123",
  "chatSharedSecret": "123abc",
  "articleId": "123",
  "gaID": "UA-103023081-1",
  "user": {
    "name": "Alice Bob",
    "email": "alice.bob+12345@zddev.com",
    "externalId": "1234"
  }
}
```

A good first step would be to change the value of `zendeskHost` to a production Zendesk account host.

Then edit the values inside the config to whatever values you like. You can then use this config in the dev task by running

```bash
USER_CONFIG={yourConfigName} npm run dev
```

This will start the dev task using the values found in `dev/configs/${yourConfigName}.json`. If no `USER_CONFIG` variable is passed, the dev task will default to using the `example-template.json` config which uses `dev.zd-dev.com`.

This will allow you to make as many different configurations as you like to test different scenarios with. It is recommended to have one for your production account.

## Running in Docker
- Follow above to get `npm run dev` running.
- Run `zdi embeddable_framework -d restart` in parallel.

### Building Docker image
- Run `npm run build` to build static assets inside `./dist`.
- Run `zdi embeddable_framework build`.
- Verify the built image with `zdi embeddable_framework restart -l`.
- To push, run `zdi embeddable_framework release --official`.

## Testing
We use the [Jasmine](http://jasmine.github.io/) framework for all our unit tests, and [ESlint](http://eslint.org/) for Javascript linting. Please run both the test and lint npm tasks before opening a pull request.

```bash
npm run lint && npm t
```

To run specific tests, specify either paths to the test files or glob patterns after `npm t`.

Examples:
```bash
# Single file
npm t test/unit/boot_test.js

# Multiple files
npm t test/unit/boot_test.js test/unit/chatPreview_test.js

# Single pattern
npm t test/unit/*_test.js

# Multiple patterns
npm t test/unit/component/chat/**/*_test.js test/unit/component/talk/**/*_test.js
```

To debug in tests, run the `test:debug` task: `npm run test:debug`. This task uses the built-in cli node.js debugger. To set a breakpoint from the source code, place a `debugger` statement on the line you want to pause execution. To inspect the value of variables run the `repl` command at a breakpoint. For more information please view the [documentation](https://nodejs.org/api/debugger.html#debugger_information).

*NOTE: The node debugger will always automatically break at the first line, just run `continue` (or `c`) to resume execution.*

## Contribute
All pull requests need two :+1:'s to be merged, *at least one from a Taipan team member*. Please also include a `/cc` to **@zendesk/taipan**. If a Taipan team member hasn't reviewed your PR in a reasonable amount of time, feel free to ping us on Slack in `#taipan-team` and do a group mention using `@taipan`.

See [STYLE.md](https://github.com/zendesk/embeddable_framework/blob/master/STYLE.md) for more information on code style.

*Note: There is a pull request template (PULL_REQUEST_TEMPLATE.md) for auto completing the description. If you have the Zendesk chrome dev tools installed this will cause a conflict so disable the dev tools before opening a PR.*

## Deploying
Please see our [Deploy guidelines](https://github.com/zendesk/embeddable_framework/blob/master/DEPLOY.md) for more information.

## Bugs
Bugs are tracked in JIRA under the Customer Engagement project (`CE`) with the component *Web Widget*. Bugs should always have clear reproduction steps, some notion of urgency/scope and relevant references.

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

## Refreshing node_module dependencies
Use `./setup-environment.sh` instead of `npm install` to update your node modules to ensure the package-lock stays in sync across computers.

## NPM tasks
Run each task like this: ```npm run <taskname>```

* **build** - Generates snippet and framework in production mode. This means the final source and assets are optimised and no sourcemaps are generated.
* **dev** - Launches a local server that automatically rebuilds the source and refreshes the browser on any changes. Navigate to any of the pages at http://localhost:1337.
* **test** - Runs all the jasmine unit tests.
* **lint** - Runs eslint on the *src* and *test* directories.

## Debugging customer issues
Sometimes we have issues that only manifest on customers sites.

### Viewing Redux logs
To see redux logging information on their site we can add a value to localstorage to surface the debug logs.

In the browsers console
```
localStorage["ZD-debug"] = true
```

After that when you refresh the page you will start seeing redux logs in your console.

## Documenting ADRs
We will be documenting architectural decisions surrounding this project under `doc/architecture/decisions`.
The standards followed are documented by Michael Nygard at:
http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions

### Tooling and ADR generation
Please refer to https://github.com/npryce/adr-tools
