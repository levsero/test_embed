#### Before opening a PR
* Please run both the `test:ci` and `lint` npm tasks before opening a pull request - a PR can't be merged until we have green status checks for these items
* All pull requests need two :+1:'s to be merged, *at least one from a Taipan team member*. Please also include a `/cc` to **@zendesk/taipan**. If a Taipan team member hasn't reviewed your PR in a reasonable amount of time, feel free to ping us on Slack in `#taipan-team` and do a group mention using `@taipan-dev`.
* Please be verbose in your PR description. The more context we have on your change, the easier it is for us to review.

#### General
* Please check in with a [Taipan](https://cerebro.zende.sk/teams/taipan) team member if your change is likely to affect shared files across multiple embedded products (eg: services, middleware, etc).
* Make sure your change works in [all browsers](https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website) from IE11 up.
* Be aware of bundle size. For a list of limitations, consult `"bundlesize"` in `package.json`.

#### Git
* Please follow our [git commit practices](https://zendesk.atlassian.net/wiki/spaces/CE/pages/279216606/Taipan+Git+Practices) when submitting a Pull Request for review.

#### JS
* Please see our [code style guidelines](STYLE.md) before committing code to our repo.

#### CSS
* Please use `rem` sizing in CSS instead of `em`.
* Avoid single-line utility composition in SCSS.

#### Testing
* All new features should have appropriate test coverage.
* All new tests should be written using the [Jest](https://jestjs.io/) JS test framework.
* Please see our [test style guidelines](TEST_STYLE.md) on how we like to see our tests written.

#### Documentation changes
* For any PRs that include documentation changes, please `/cc` **@zendesk/documentation** for an extra +1 on your pull request

**Don't forget to feel warm and fuzzy knowing you helped us out :)**
