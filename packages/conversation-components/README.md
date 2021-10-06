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

The steps to release are as follows:

Update the version in `package.json`, since we are still pre v1.0, each version bump should just be a patch (e.g. 0.0.2 -> 0.0.3).

```shell
# First make sure all tests are still passing
yarn test packages/conversation-components

# Build the latest version
yarn workspace @zendesk/conversation-components build

# Do the release
yarn workspace @zendesk/conversation-components publish
```

The `publish` script will display the current version (which is the version you entered in `package.json`),
then it will ask you for the "new version", just key in the same number as the "current version"

Next you will be asked for your Artifactory

1. username (User Profile)
2. email (Zendesk email)
3. password (API Key)
   Which can be found here https://zdrepo.jfrog.io/ui/admin/artifactory/user_profile

Verify your release exists here https://zdrepo.jfrog.io/ui/repos/tree/General/npm%2F@zendesk%2Fconversation-components

- expand the conversation-components folder all the way to the @zendesk folder
- in the @zendesk folder search for the `.tgz` file that contains the new version number
- e.g. `conversation-components-0.0.18.tgz`

Verify the release is working with `create-react-app`

- create a React app with `create-react-app`
- in `Appjs` import conversation components and render one of the components

Example:

```javascript
import { MessengerHeader, ThemeProvider } from '@zendesk/conversation-components'
.
.
.
<ThemeProvider>
  <MessengerHeader isCompact={false}>
    Conversation Components
  </MessengerHeader>
</ThemeProvider>
```

Once verified that it's working n the React app, create a PR bumping the version to the release you would like. There should be no other code changes in the pr.
