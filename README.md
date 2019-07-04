# Embeddable Framework [![Build Status](https://travis-ci.com/zendesk/embeddable_framework.svg?token=qxD282ay7Y6ibWdkzBiB&branch=master)](https://travis-ci.com/zendesk/embeddable_framework)[![FOSSA Status](https://app.fossa.io/api/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git.svg?type=shield)](https://app.fossa.io/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git?ref=badge_shield)

## Description
A 3rd party embeddable framework that handles bringing Zendesk outside of the agent view and onto 3rd party websites.

## Owners
This repository is maintained by [Team Taipan](https://zendesk.atlassian.net/wiki/pages/viewpage.action?pageId=86114732). You can get in touch with us via:
* Email **taipan@zendesk.com**
* Slack **#taipan-team** channel
* Mention **@zendesk/taipan** on Github
* [Taipan JIRA Sprint Board](https://zendesk.atlassian.net/jira/software/projects/EWW/boards/1270)
* [Taipan JIRA Backlog](https://zendesk.atlassian.net/jira/software/projects/EWW/boards/1270/backlog)

We are based in Melbourne, Australia and our timezone is **GMT+10**. You can always check the [time](http://time.is/Melbourne) in Melbourne.

## Getting Started

### Prerequesites
- [Ruby version manager (rbenv)](https://github.com/rbenv/rbenv)
- [Node version manager (nvm)](https://github.com/nvm-sh/nvm)

_Tip: Add `eval "$(rbenv init -)"` to your `.bash_profile`/`.zshrc` so rbenv starts up automatically_

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
```
localStorage["ZD-debug"] = true
```

After that when you refresh the page you will start seeing redux logs in your console and redux devtools if you have the [browser extension](https://github.com/zalmoxisus/redux-devtools-extension) installed.

## Documenting ADRs
We will be documenting architectural decisions surrounding this project under `doc/architecture/decisions`.
The standards followed are documented by Michael Nygard at:
http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions

### Tooling and ADR generation
Please refer to https://github.com/npryce/adr-tools

## Documenting APIs

See <a href="https://zendesk.atlassian.net/wiki/spaces/DOC/pages/641704628/How+developer+docs+are+produced+at+Zendesk" target="_blank">How developer docs are produced at Zendesk</a> on the Docs team wiki.

Please cc **@zendesk/documentation** on any PR that adds or updates documentation on the developer portal at https://developer.zendesk.com.
