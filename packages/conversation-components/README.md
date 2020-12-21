# Conversation Components [![Build Status](https://github.com/zendesk/embeddable_framework/workflows/repo-checks/badge.svg)](https://github.com/zendesk/embeddable_framework/workflows/repo-checks/badge.svg)[![FOSSA Status](https://app.fossa.io/api/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git.svg?type=shield)](https://app.fossa.io/projects/custom%2B4071%2Fgit%40github.com%3Azendesk%2Fembeddable_framework.git?ref=badge_shield)

## Description

React components for the Web SDK

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

### Basic commands

```bash
# Build package
yarn workspace @zendesk/conversation-components build

# Rebuild every time you make changes
yarn workspace @zendesk/conversation-components watch

# Start storybook
yarn workspace @zendesk/conversation-components storybook
```

## Releasing

### Release a new version

The steps to release are as follows

Create a PR bumping the version to the release you would like. There should be no other code changes in the pr.

Since we are still pre v1.0, each version bump should just be a patch (e.g. 0.0.2 -> 0.0.3).

Once your PR has been thumbed and merged, run the following commands

```shell
# First make sure all tests are still passing
yarn workspace @zendesk/conversation-components test

# Build the latest version
yarn workspace @zendesk/conversation-components build

# Do the release
yarn workspace @zendesk/conversation-components publish
```

When it asks you for the version, enter the version you put through in the PR.

When it asks you for login details, use your Artifactory username and API Key found here https://zdrepo.jfrog.io/ui/admin/artifactory/user_profile

Verify your release exists here https://zdrepo.jfrog.io/ui/repos/tree/General/npm%2F@zendesk%2Fconversation-components
