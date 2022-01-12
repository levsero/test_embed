# Embeddable Framework [![Build Status](https://github.com/zendesk/embeddable_framework/workflows/repo-checks/badge.svg)](https://github.com/zendesk/embeddable_framework/workflows/repo-checks/badge.svg)[![FOSSA Status](https://app.fossa.io/api/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git.svg?type=shield)](https://app.fossa.io/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git?ref=badge_shield)

## Description

A 3rd party embeddable framework that handles bringing Zendesk outside of the agent view and onto 3rd party websites.

## Owners

This repository is maintained by [Team Emu](https://zendesk.atlassian.net/wiki/pages/viewpage.action?pageId=86114732). You can get in touch with us via:

- Email **emu@zendesk.com**
- Slack **#emu-team** channel
- Mention **@zendesk/emu** on Github
- [Web Widget JIRA Sprint Board](https://zendesk.atlassian.net/jira/software/projects/EWW/boards/1270)
- [Web Widget JIRA Backlog](https://zendesk.atlassian.net/jira/software/projects/EWW/boards/1270/backlog)

We are based in Melbourne, Australia and our timezone is **GMT+10**. You can always check the [time](http://time.is/Melbourne) in Melbourne.

## Getting Started

### Prerequisites

- [Ruby version manager (rbenv)](https://github.com/rbenv/rbenv)
- [Node version manager (nvm)](https://github.com/nvm-sh/nvm)

_Tip: Add `eval "$(rbenv init -)"` to your `.bash_profile`/`.zshrc` so rbenv starts up automatically_

### Run the bootstrap script

Run the following commands inside this folder:

```bash
./script/bootstrap
```

The bootstrap file will do the following:

- Run `./script/setup_node_env` to install the correct versions of nvm, node, npm and yarn, as well as all npm dependencies.
- Run `bundle install` to get ruby dependencies
- Run `yarn workspace @zendesk/embeddable-framework build` to generate snippet, framework and example files

### Running packages

Each package inside `./packages` will have its own README.md with its own instructions for how to run the package.

Since this project uses [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/), you can run a specific script for a package with the command `yarn workspace <package name> <script to run>`

E.g. to run the embeddable framework with the developer dashboard you can run

```sh
yarn workspace @zendesk/embeddable-framework dashboard
```

This will allow you to access the developer dashboard on [http://localhost:1338](http://localhost:1338).

The packages contained are:

- [Conversation components](/packages/conversation-components) - Shared components for the new sunco experience
- [Framework](/packages/framework) - Entry point to select the appropriate widget
- [Web Widget Classic](/packages/web-widget-classic) - Code base for the Classic Web Widget (and its embeds like Chat, Talk, Help Center, Answer Bot)
- [Web Widget Messenger](/packages/web-widget-messenger) - Code base for the Web Widget Messenger and its features
- [Shared Services](/packages/shared-services) - Code for services shared by both Web Widget Classic and Messenger
- [Sunco JS Client](/packages/sunco-js-client) - A client side JS library that communicates with the Sunco SDK API

_Please note_ - In order to build and run locally in your dev environment you will need to build the 2 dependencies

```bash
yarn workspace @zendesk/conversation-components build
yarn workspace @zendesk/sunco-js-client build

```

#### Keeping node and npm packages up to date

You can safely run the `./script/setup_node_env` script at any time, even on top of an existing install.

The `./script/setup_node_env` script will ensure that all Dev team members are using the exact same versions of node, npm, yarn and npm packages defined in our lock file.

```bash
./script/setup_node_env
```

## Bugs

Please inform us of any bugs that you have to report in our #taipan-team Slack channel and tag your comment with @taipan-firefighter.

## Documenting ADRs

We document architectural decisions surrounding this project under `doc/architecture/decisions`.

For more information about ADRs in the Web Widget, please see [Confluence - Web Widget ADRs](https://zendesk.atlassian.net/wiki/spaces/WEB/pages/4921822311/ADRs).

### Tooling and ADR generation

Please refer to [https://github.com/npryce/adr-tools](https://github.com/npryce/adr-tools)
