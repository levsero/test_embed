# Widget Splitting

Datee: 2021-06-08

## Attendees

Emu

Copperhead

## Status

Approved

## Authors:

Alex Robinson Tim Patullock Levi Serebryanski Wayne See Matt Doyle

## Stakeholders:
emu-engineers@zendesk.com copperhead-engineers@zendesk.com

## Summary / TL;DR
Migration of the Web Widget Classic and Web Widget Messaging widgets from the framework package into their own packages, and deploying them independently of each other.

## Glossary
Web Widget Classic (Classic) - The classic web widget
Web Widget Messaging (Messaging) - The newly created messaging app

## Context
The Classic and Messaging widgets currently share the same codebase as well as webpack config. When we update an element within Messaging or Classic, the update risks breaking the other widget due to the shared use of dependencies and utility functions. This slows the development of either widget since we must spend time ensuring that changes didn’t break the other. This also propagates to tests, where we need to run tests over both widgets, wasting valuable developer time.

To mitigate this, we intend to separate these widgets out so that development on one doesn’t affect the other. Because the widgets should never appear on the same website at the same time, this allows us to fully separate their concerns and split their delivered packages and dependencies. Another benefit of splitting the packages is that we would be able to split up the Samson build and release pipeline, so that if one widget goes down due to a code change, the development of the other widget would not be affected.

## Precursor discussion
### The concept of `products` in EKR
Some of these ideas rely on the ability to switch which `product` we serve from EKR. Work had been ongoing regarding separating Answer Bot from the Web Widget, so the concept has some foundation in our deployment. Ideally this would allow us to selectively serve Messaging widget completely separately from the Classic widget. With EKR being updated whenever we enable either widget via the admin interface.

## Additional Reading
* [Backend of the Embeddable Framework delivery pipeline](https://lucid.app/lucidchart/invitations/accept/inv_27a611c1-5c67-4c4f-aea0-3e37ab1dd37f)
* [Staged rollouts for the Embeddable Framework](https://docs.google.com/document/d/1ITdFq_JPgIuxRdWMV3Gz3ZWN_fbfMflCf0m3_NRO_U0/edit#)
* [Tasks list per Product](https://docs.google.com/document/d/1TUDNiLkdHIA_DSgk6k2dk9EPm43728OWBKDloIuQsuI/edit?usp=sharing)
* [Huddle Deployment Decisions](https://docs.google.com/document/d/1Ee7OPxZt02ea6XQrfDyWM_F0XNonOjBP1w6bJ3q-APc/edit?usp=sharing)
* [Widget Code Split Epic](https://zendesk.atlassian.net/jira/software/projects/EWW/boards/1270/backlog?issueParent=774454)

## Objectives
Clear separation of concerns between the widgets
Deploy & roll-back each widget independently
Simpler webpack configuration & setup
Faster individual deploy times
Faster build times
Faster testing times
Reduced deploy steps per samson product

## Proposal
To achieve the above objectives we propose to separate the widgets into their own packages. Doing so will allow us to fully separate their concerns and split their delivered packages and dependencies. Development on one widget should not affect the other.


### Phase 1 - Frontend only split using Module Federation

Using the current backend infrastructure, we can utilise Webpack 5 and Module Federation to build and dynamically import the widgets independently. This will not require significant changes to Framework, preload, and EKR, instead focusing on properly delineating the already-existing widget imports and creating individual builds for them.

#### Method
* Implement unique Entry points for each widget, these should provide `init` and `run` functions for the Framework to consume
* Move the widgets into their own packages (see file structure example)
* Create two new Webpack config files for each widget to consume the new entry points and remove the need for a common webpack file
* Configure ModuleFederationPlugin to expose and load modules remotely
* Move shared utilities up into their own packages to be consumed by the widgets
* Split out the translations for the Classic widget and Messaging widget
* Update Deployment pipeline to deploy the new assets to S3 and point to the new assets

See https://github.com/zendesk/embeddable_framework/pull/4470 for an example Module Federation POC
```
File structure example

- packages
  - conversation-components
  - web-widget-messaging
    - package.json
    - src
      - index.js
      - etc.
    - webpack
  - web-widget-classic
    - package.json
    - src
      - index.js
      - etc.
    - webpack
  - framework
    - src
      - framework
        - index.js
        - etc.
  - widget-beacon
  - widget-bootstrap
  - widget-google-analytics?
  - widget-http
  - widget-public-api
  - widget-host-page-window?
  - widget-i18n
  - widget-persistence
  - etc.
```


#### Shared dependencies
Each widget will be clear about the shared dependencies that it relies on in the monorepo. To avoid the need for versioning these shared dependencies we can use a wildcard approach in our `package.json` file which ensures we always bundle with the latest code.

Example:
```
web-widget-messaging/package.json

dependencies: {
	@zendesk/widget-beacon: ”*”,
}
```

Example Pull Request: [@zendesk/widget-persistence](https://github.com/zendesk/embeddable_framework/pull/4457)

### Deployment
#### Versioning (how to know which widget version to download)
##### Single Deploy
During our deployment step, we append the current SHA onto the names of the entry points and generated apps, this way we can get away without generating any new deployment trains or updating EKR. Framework could then simply access the other generated widgets effectively the same way we do now:
* `/latest/webWidget/framework/framework-abc123`
* `/latest/webWidget/messaging/messaging-abc123`
* `/latest/webWidget/classic/classic-abc123`

[Example flow in LucidChart](https://lucid.app/lucidchart/invitations/accept/inv_459b1eb0-9c98-46fd-a64c-8d7a8e92552e)

ModuleFederation allows us to use window variables via the `ExternalRemoteTemplatePlugin` to control which version to load,

Example Module Federation Webpack config:
```js
new ModuleFederationPlugin({
  name: "@zendesk/embeddable-framework",
  remotes: {
    messaging: "messaging@https://static.zdassets.com/messaging/latest/messagingEntry-[widgetVersion].js",
    classic: "classic@https://static.zdassets.com/classic/latest/classicEntry-[widgetVersion].js",
  }
})
```


## Phase 2 - End To End split
With the widgets functionally independent of each other, we can begin properly separating their deployments so that we can allow them to be served independently of each other, allowing us to decouple their development.

The Framework package could now begin loading the widgets at their latest value without having to compile all three at build time, we can do this by serving their versions down from EKR to Asset Composer and then having Asset Composer paste their versions into the window object for Framework to individually use.

This is possible since the ExternalRemoteTemplatePlugin allows us to resolve their hosted versions and locations at runtime.

[Example PR using import syntax.](https://github.com/zendesk/embeddable_framework/pull/4470)

[Example PR with async entrypoint retrieval.](https://github.com/zendesk/embeddable_framework/pull/4486)

### Deployment
#### Single String
If we were to want to fully deploy the packages individually, we would need to allow EKR to record the latest versions of each package and serve those values to Asset Composer, we could do this via updating the current web_widget_version from its single value to instead serve three values in a single string eg. `abc123/def456/ghi789` for the `Framework/Messaging/Classic` individually (order/structure TBD). This would require minimal change to EKR and Asset Composer.


When we deploy a change to each individual product, we would then update the string to use the new SHA.

For example, an update to Messaging would change it from `abc123/def456/ghi789`  to `abc123/def789/ghi789`. We can then read those values in Framework and use the `ExternalTemplateRemotePlugin` to pull those specific versions down.

Example Module Federation Webpack config:
```js
new ModuleFederationPlugin({
  name: "@zendesk/embeddable-framework",
  remotes: {
    messaging: "messaging@https://static.zdassets.com/messaging/latest/messagingEntry-[messagingVersion].js",
    classic: "classic@https://static.zdassets.com/classic/latest/classicEntry-[classicVersion].js",
  }
})
```

## Phase 3: Multiple Products stored in EKR
A more complex change to EKR would be to serve these versions individually, so we’d have a value for the Framework, Messaging widget, and Classic widget. This would be accessed similarly to the above, but instead formalized as separate products instead of subsections of a string.

