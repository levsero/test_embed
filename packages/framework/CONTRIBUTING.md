#### Before opening a PR

- Please run both the `test:ci` and `lint` npm tasks before opening a pull request - a PR can't be merged until we have green status checks for these items
- All pull requests need two :+1:'s to be merged, _at least one from a Taipan team member_. Please also include a `/cc` to **@zendesk/taipan**. If a Taipan team member hasn't reviewed your PR in a reasonable amount of time, feel free to ping us on Slack in `#taipan-team` and do a group mention using `@taipan-dev`.
- Please be verbose in your PR description. The more context we have on your change, the easier it is for us to review.

#### General

- Please check in with a [Taipan](https://cerebro.zende.sk/teams/taipan) team member if your change is likely to affect shared files across multiple embedded products (eg: services, middleware, etc).
- Make sure your change works in [all browsers](https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website) from IE11 up.
- Be aware of bundle size. For a list of limitations, consult `"bundlesize"` in `package.json`.

#### i18n

All string values added into the repo must done through [Rosetta](https://github.com/zendesk/rosetta) - Zendesk's service for translations

Simple guide to adding a new translation

1. Upload an image of app using the string you want to be translated to the [Google Drive folder for Web Widget translations](https://drive.google.com/drive/folders/1GCxTJCgh8QY81aHCccEzDeJeY_KZq0L1). The filename should match the translation key
2. Add your translation to the [translations file](config/locales/translations/embeddable_framework.yml) following the guidelines in the [String Creation, Modification and Deletion](https://zendesk.atlassian.net/wiki/spaces/globalization/pages/146113135/String+Creation+Modification+and+Deletion) document
3. Create a PR with just your translation change
4. After the PR is merged, your translation will be part of the next [string sweep](https://zendesk.atlassian.net/wiki/spaces/globalization/pages/625345680/String+Sweep+Overview) on Friday, and available to be used on the following Thursday (see [Weekly Translation Schedule](https://zendesk.atlassian.net/wiki/spaces/globalization/pages/146112939/Weekly+Translation+Schedule))

Useful links:

- [Translation landing page for developers](https://zendesk.atlassian.net/wiki/spaces/globalization/pages/264344745/Landing+Page+for+Developers)
- [String Creation, Modification and Deletion](https://zendesk.atlassian.net/wiki/spaces/globalization/pages/146113135/String+Creation+Modification+and+Deletion)
- [Upload screenshots to Google Drive](https://zendesk.atlassian.net/wiki/spaces/globalization/pages/401277972/Upload+screenshots+to+Google+Drive)
- [String Sweep Overview](https://zendesk.atlassian.net/wiki/spaces/globalization/pages/625345680/String+Sweep+Overview)
- [Weekly Translation Schedule](https://zendesk.atlassian.net/wiki/spaces/globalization/pages/146112939/Weekly+Translation+Schedule)

#### Git

- Please follow our [git commit practices](https://zendesk.atlassian.net/wiki/spaces/CE/pages/279216606/Taipan+Git+Practices) when submitting a Pull Request for review.
- QA testing must accompany code review. In order to facilitate smoother deploys and rollbacks, changes should, where possible, be tested thoroughly before merging to master.

#### JS

- Please see our [code style guidelines](STYLE.md) before committing code to our repo.

#### CSS

- Please use `rem` sizing in CSS instead of `em`.
- Avoid single-line utility composition in SCSS.

#### Testing

- All new features should have appropriate test coverage.
- All new tests should be written using the [Jest](https://jestjs.io/) JS test framework.
- Please see our [integration](TEST_STYLE.md) and [browser](BROWSER_TEST_STYLE.md) style guides on how we like to see our tests written.

#### Documentation changes

- For any PRs that include documentation changes, please `/cc` **@zendesk/documentation** for an extra +1 on your pull request

**Don't forget to feel warm and fuzzy knowing you helped us out :)**
