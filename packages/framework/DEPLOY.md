# Deployment

| Resource       | Link                                                           |
| :------------- | :------------------------------------------------------------- |
| Samson         | https://samson.zende.sk/projects/embeddable_framework          |
| GitHub Actions | https://github.com/zendesk/embeddable_framework/actions        |
| Jenkins        | https://jenkins.zende.sk/view/Web-Widget-Staging-Health/       |
| Datadog        | https://zendesk.datadoghq.com/dashboard/qdb-cmm-tg2/web-widget |

## Rules

- Notify [#team-taipan] before deploying or for help.
- Taipan is located in Melbourne (AEST). Try to avoid [off hour](https://www.timeanddate.com/worldclock/australia/melbourne) deployments
- We don't have a strict schedule, but try to avoid deploying after 3PM our time.
- A Deploy Buddy is required for all deploys to production.
- Don't deploy if any [staging status] tests are red without an exemption.
- Any PRs deployed must meet the [contributing guidelines](https://github.com/zendesk/embeddable_framework/blob/master/CONTRIBUTING.md)

### Code Freeze

**Do not deploy** if any of the [staging status] tests are red. These must be green before anyone can deploy unless an exemption is approved. This must be approved the same way as a normal [production freeze]

**Do not deploy** if a change freeze is in place unless an exemption is approved for a critical bug fix. They usually occur during big holidays and near the quaterly investor calls. To check, please look at the [production freeze] schedule.

## Samson Stages

| Stage                      | S3 Bucket                              | Notes                                                                         |
| :------------------------- | :------------------------------------- | :---------------------------------------------------------------------------- |
| Build Staging              | static-staging.zdassets.com/web_widget | Builds and deploys static assets to the staging S3 bucket                     |
| Release Staging            | static-staging.zdassets.com/web_widget | Updates staging environment to use the tagged version of the static assets    |
| Deploy Popout (Staging)    | static-staging.zdassets.com/web_widget | Builds and deploys popout html file, Does not need to be released             |
| Build Production           | static.zdassets.com/web_widget         | Builds and deploys static assets to the production S3 bucket                  |
| Release Production         | static.zdassets.com/web_widget         | Updates production environment to use the tagged version of the static assets |
| Deploy Popout (Production) | static.zdassets.com/web_widget         | Builds and deploys popout html file, Does not need to be released             |

## Deployment Process

Pull Requests are merged into `master` branch after receiving two 👍s. At lease one of these must come from a member of [#team-taipan].

Samson will automatically deploy new tags to `Build Staging`, `Release Staging` and `Build Production`.

Once the deploy is finished it will trigger our [automatic tests](https://jenkins.zende.sk/job/Web%20Widget/job/Dependencies/) to run in staging.

Make sure that [staging status] tests are green and we are not in a [production freeze] before deploying to production.

Deploys to production require a buddy. Please ping someone from Taipan via Slack [#team-taipan] if you need a buddy.

### Build Stages

During this stage, all the necessary files for the widget are built and uploaded to an S3 bucket. They are built automatically on merge to master for both staging (`Build Staging`) and production (`Build Production`). The widget remains unchanged after the stage finishes.

This stage typically takes 10 to 15 minutes to run.

### Release Stages

This stage is responsible for updating the version of the widget being used in staging or production. Widget version is controlled by
[Embed Key Registry](https://github.com/zendesk/embed_key_registry) and the release stages will update the version of the widget in
EKR.

`Release Staging` occurs automatically after `Build Staging` finishes, but `Release Production` is manually run. This stage typically
takes less than a minute to complete.

### LiveChat Popout

The popout is a static HTML file that is used to display the live chat popout window. It's loaded by customers through a static URL
(e.g. https://static.zdassets.com/web_widget/latest/liveChat.html in production). It is deployed independently of the widget and as
such has its own stage.

## Recovery

If there is a problem with the deployed version you will need to rollback to the previous stable version via Samson. As mentioned earlier, you can very quickly re-deploy a working older release to the `Release Production` stage. There is no need to
run `Build Production` if you just need to rollback to an older existing version.
If the problem is going to take some time to fix, please revert your PR so that it's not holding up other deploys.

Please notify [#team-taipan] if a rollback has occurred out of Melbourne hours.

We have a [runbook](https://zendesk.atlassian.net/wiki/display/rb/Embeddable+Runbook) to help diagnose common problems.

## Verification

- Test your changes on a production account.
- Keep an eye on our [health dashboards](https://app.datadoghq.com/screen/156652/taipan-health-dashboard) to make sure nothing is out of the ordinary. This dashboard shows anomaly data on metrics when they are below or above the regular thresholds. Note that it is normal to see occasional spikes in certain metrics that will appear as anomaly data, however, if any metrics are consistently abnormal it may be related to a recent deploy.
- Make sure our [Production Smoke tests](https://jenkins.zende.sk/view/Embeddables/job/widget_production_smoke_test/) pass.

[#team-taipan]: https://zendesk.slack.com/messages/C0R1EJ3UP/
[staging status]: https://jenkins.zende.sk/job/Web%20Widget/job/Widget%20Staging%20Status/
[production freeze]: https://zendesk.atlassian.net/wiki/display/ops/Production+Freeze
