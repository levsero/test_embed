## Thank you

Thanks for your interest in the Web Widget. Improvements and bug-fixes are always welcome!

## Getting started

Please see the [readme](https://github.com/zendesk/embeddable_framework#getting-started) on how to get the Widget running locally for development.

## Making changes

Once the Widget is running locally, checkout a new branch and make your changes there. When making changes, there are a few things to keep in mind:

### General
* Please check in with a [Taipan](https://cerebro.zende.sk/teams/taipan) team member if your change is likely to affect shared files across multiple embedded products (eg: services, middleware, etc).
* Make sure your change works in [all browsers](https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website) from IE11 up.
* Be aware of bundle size. For a list of limitations, consult `"bundlesize"` in `package.json`.

### CSS
* Please use `rem` sizing in CSS instead of `em`.
* Avoid single-line utility composition in SCSS.

### Testing
* All new features should have appropriate test coverage.
* New tests should be written using the [Jest](https://jestjs.io/) JS test framework.

### Git
* Please follow [these guidelines](https://zendesk.atlassian.net/wiki/spaces/CE/pages/279216606/Taipan+Git+Practices) on our Git practices for smooth reviews and merging.
* Be verbose in your PR description. The more context we have on your change, the easier it is for us to review.

Drop us a line in the `#taipan-team` Slack channel when you're done so we don't miss your PR. When you have two approving reviews from team members, you can merge your changes to master.

Don't forget to feel warm and fuzzy knowing you helped us out :)
