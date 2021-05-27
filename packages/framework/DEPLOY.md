# Deployment

| Resource       | Link                                                           |
| :------------- | :------------------------------------------------------------- |
| Samson         | https://samson.zende.sk/projects/embeddable_framework          |
| GitHub Actions | https://github.com/zendesk/embeddable_framework/actions        |
| Jenkins        | https://jenkins.zende.sk/view/Web-Widget-Staging-Health/       |
| Datadog        | https://zendesk.datadoghq.com/dashboard/qdb-cmm-tg2/web-widget |
| Rollbar        | https://rollbar-eu.zendesk.com/Zendesk/Embeddable-Framework/   |

## Rules

- Notify [#team-taipan] before deploying or for help.
- Taipan is located in Melbourne (AEST). Try to avoid [off hour](https://www.timeanddate.com/worldclock/australia/melbourne) deployments
- We don't have a strict schedule, but try to avoid deploying after 3PM our time.
- A Deploy Buddy is required for all deploys to production.
- Don't deploy if any [staging status] tests are red without an exemption.
- Any PRs deployed must meet the [contributing guidelines](https://github.com/zendesk/embeddable_framework/blob/master/packages/framework/CONTRIBUTING.md)

### Code Freeze

**Do not deploy** if any of the [staging status] tests are red. These must be green before anyone can deploy unless an exemption is approved. This must be approved the same way as a normal [production freeze]

**Do not deploy** if a change freeze is in place unless an exemption is approved for a critical bug fix. They usually occur during big holidays and near the quaterly investor calls. To check, please look at the [production freeze] schedule.

## Samson Stages

| Stage                                     | S3 Bucket                              | Notes                                                                                |
| :---------------------------------------- | :------------------------------------- | :----------------------------------------------------------------------------------- |
| Build Staging                             | static-staging.zdassets.com/web_widget | Builds and deploys static assets to the staging S3 bucket                            |
| Release Staging - Canary (Tier 1)         | static-staging.zdassets.com/web_widget | Updates staging canary environment to use the tagged version of the static assets    |
| Release Staging - General Availability    | static-staging.zdassets.com/web_widget | Updates staging environment to use the tagged version of the static assets           |
| Release Staging Previewer                 | static-staging.zdassets.com/web_widget | Updates the staging environment to use the tagged version of the previewer           |
| Release Staging - VIP (Tier 2)            | static-staging.zdassets.com/web_widget | Updates staging VIP environment to use the tagged version of the static assets       |
| Deploy Popout (Staging)                   | static-staging.zdassets.com/web_widget | Builds and deploys popout html file, Does not need to be released                    |
| Build Production                          | static.zdassets.com/web_widget         | Builds and deploys static assets to the production S3 bucket                         |
| Release Production - Canary (Tier 1)      | static.zdassets.com/web_widget         | Updates production canary environment to use the tagged version of the static assets |
| Release Production - General Availability | static.zdassets.com/web_widget         | Updates production environment to use the tagged version of the static assets        |
| Release Production Previewer              | static.zdassets.com/web_widget         | Updates the production environment to use the tagged version of the previewer        |
| Release Production - VIP (Tier 2)         | static.zdassets.com/web_widget         | Updates production VIP environment to use the tagged version of the static assets    |
| Deploy Popout (Production)                | static.zdassets.com/web_widget         | Builds and deploys popout html file, Does not need to be released                    |

## Deployment Process

Pull Requests are merged into `master` branch after receiving two 👍s. At least one of these must come from a member of [#team-taipan].

Samson will automatically deploy new tags to `Build Staging` and `Build Production`.

### Build Stages

During this stage, all the necessary files for the widget are built and uploaded to an S3 bucket. They are built automatically on merge to master for both staging (`Build Staging`) and production (`Build Production`). The widget remains unchanged after the stage finishes.

This stage typically takes 10 to 15 minutes to run.

### Release Stages

This stage is responsible for updating the version of the widget being used in staging or production. Widget version is controlled by
[Embed Key Registry](https://github.com/zendesk/embed_key_registry) and the release stages will update the version of the widget in
EKR. This stage typically takes less than a minute to run.

Embeddable Framework uses a staged rollout mechanism, where the assets are deployed to buckets of customers in stages. There are
3 stages in the deploy pipeline: Tier 1, the general availability release, and Tier 2.

#### Staging

In staging, the release to the 3 stages occur simultaneously, and the release is triggered automatically after `Build Staging` finishes.

Once the deploy is finished it will trigger our [automatic tests](https://jenkins.zende.sk/job/Web%20Widget/job/Dependencies/) to run in staging.

#### Production

Production deploys are done in stages. All production stages require a buddy. Please ping someone from Taipan via Slack [#team-taipan] when Samson asks for a deploy buddy. Do not deploy during a [production freeze] unless an exemption has been granted.

These are the steps for deploying changes to production:

1. The first step is deploying to the canary group (`Release Production - Canary (Tier 1)`). Make sure that
   [staging status] tests have all run and are passing before doing a deployment.
   Once deployed, allow a soak time of at least 30 minutes in this stage and only proceed to the next stage if
   [canary tests](https://jenkins-smoke.zende.sk/job/smoke_canary/view/Web%20Widget/) are all green.

2. The second step is the general availability release (`Release Production - General Availability`). This updates all customers who aren't in Tier 1 or Tier 2. Most
   customers will be in this stage. Soak time for this should be longer, depending on the risk of the deployment.

   | Risk   | Soak time |
   | :----- | :-------- |
   | Low    | 3 hours   |
   | Medium | 3 days    |
   | High   | 5 days    |

3. The final step is deploying the widget to the critical customer group (`Release Production - VIP (Tier 2)`).

To verify what versions are currently deployed to each stage you can view this [API](https://ekr.zdassets.com/products/web_widget).

| Property       | Group                |
| :------------- | :------------------- |
| versions.tier1 | Canary               |
| version        | General availability |
| versions.tier2 | VIP                  |

To see what version your Web Widget is using, in the browser console you can log out zE.version. This will be the shorter hash of the release your Web Widget is on.

### Release Previewer

The previewer is automatically pipelined to be run after the general availability release stage (`Release Staging - General Availability` and `Release Production - General Availability`).

### LiveChat Popout

The popout is a static HTML file that is used to display the live chat popout window. It's loaded by customers through a static URL
(e.g. https://static.zdassets.com/web_widget/latest/liveChat.html in production). It is deployed independently of the widget and as
such has its own stage.

## Recovery

If there is a problem with the deployed version you will need to rollback to the previous stable version via Samson. As mentioned earlier,
you can very quickly re-deploy a working older release to the corresponding `Release *` stage. There is no need to
run `Build Production` if you just need to rollback to an older existing version.
If the problem is going to take some time to fix, please revert your PR so that it's not holding up other deploys.

Please notify [#team-taipan] if a rollback has occurred out of Melbourne hours.

We have a [runbook](https://zendesk.atlassian.net/wiki/display/rb/Embeddable+Runbook) to help diagnose common problems.

## Verification

- Test your changes on a production account.
- Keep an eye on our [web widget](https://zendesk.datadoghq.com/dashboard/qdb-cmm-tg2/web-widget) and [upstream](https://zendesk.datadoghq.com/dashboard/yut-9gq-ru7/web-widget-upstream-dependencies) dashboards to make sure nothing is out of the ordinary. These dashboards shows anomaly data on metrics when they are below or above the regular thresholds. Note that it is normal to see occasional spikes in certain metrics that will appear as anomaly data, however, if any metrics are consistently abnormal it may be related to a recent deploy.
- Make sure our [Production Smoke tests](https://jenkins-smoke.zende.sk/job/smoke_production/view/Web%20Widget/) pass.
- Check [Rollbar](https://rollbar-eu.zendesk.com/Zendesk/Embeddable-Framework/) for any new errors.

[#team-taipan]: https://zendesk.slack.com/messages/C0R1EJ3UP/
[staging status]: https://jenkins.zende.sk/view/Web-Widget-Staging-Health/
[production freeze]: https://zendesk.atlassian.net/wiki/display/ops/Production+Freeze
