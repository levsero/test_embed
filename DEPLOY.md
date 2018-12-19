# Deployment

| Resource  | Link                                                      |
|:----------|:----------------------------------------------------------|
| Samson    | https://samson.zende.sk/projects/embeddable_framework     |
| Travis CI | https://travis-ci.com/zendesk/embeddable_framework/builds |
| Jenkins   | https://jenkins.zende.sk/view/Embeddables/                |
| Datadog   | https://app.datadoghq.com/screen/22529/embeddable-v2      |

## Rules

- Notify [#team-taipan](https://zendesk.slack.com/messages/C0R1EJ3UP/) before deploying or for help.
- Taipan is located in Melbourne (AEST). Try to avoid [off hour](https://www.timeanddate.com/worldclock/australia/melbourne) deployments
- We don't have a strict schedule, but try to avoid deploying after 3PM our time.
- A Deploy Buddy is required for all deploys to production.
- Don't deploy if any [staging status](https://jenkins.zende.sk/view/StagingStatus/) tests are red without an exemption.
- Any PRs deployed must meet the [Contributing guidelines](https://github.com/zendesk/embeddable_framework/blob/master/CONTRIBUTING.md)

### Code Freeze

Do not deploy if any of the [staging status](https://jenkins.zende.sk/view/StagingStatus/) tests are red. Even if they are not our tests. These must be green before anyone can deploy unless an exemption is approved. This must be approved the same way as a normal [production freeze](https://zendesk.atlassian.net/wiki/display/ops/Production+Freeze)

Do not deploy if a change freeze is in place unless an exemption is approved for a critical bug fix. They usually occur during big holidays and near the quaterly investor calls. To check please look at the [Production Freeze Schedule](https://zendesk.atlassian.net/wiki/display/ops/Production+Freeze)


## Stages

| Stage                      | S3 Bucket                              | Notes                                                                         |
|:---------------------------|:---------------------------------------|:------------------------------------------------------------------------------|
| Build Staging              | static-staging.zdassets.com/web_widget | Builds and deploys static assets to the staging S3 bucket                     |
| Release Staging            | static-staging.zdassets.com/web_widget | Updates staging environment to use the tagged version of the static assets    |
| Deploy Popout (Staging)    | static-staging.zdassets.com/web_widget | Builds and deploys popout html file, Does not need to be released             |
| Build Production           | static.zdassets.com/web_widget         | Builds and deploys static assets to the production S3 bucket                  |
| Release Production         | static.zdassets.com/web_widget         | Updates production environment to use the tagged version of the static assets |
| Deploy Popout (Production) | static.zdassets.com/web_widget         | Builds and deploys popout html file, Does not need to be released             |

## Deployment Process

Pull Requests are merged into `master` branch after receiving two 👍s. At lease one of these must come from a member of [#team-taipan](https://zendesk.slack.com/messages/C0R1EJ3UP/).

Samson will automatically deploy new tags to `Build Staging`, `Release Staging` and `Build Production`.

### Static Assets

All of our files are deployed to a s3 bucket. They are built automatically on merge to master and then uploaded to an S3 bucket in a directory named after the release (`V<release_num>`). This allows us to perform the slow build portion of deployment once for each release, and then deploy to staging or production hosts very quickly by simply updating the latest version to the new SHA. If a roll-back is required, we can target an earlier release and very quickly deploy it to production.

### Master

There is no master environment, this is simply the dev setup.

### Staging

As mentioned earlier, once a release is deployed to `Build Staging`, you can then deploy the release to the `Release Staging` stage. This will update the latest version to point to the released SHA. This can be found at:

```
https://static-staging.zdassets.com/web_widget/latest/web_widget.js
```

Once the deploy is finished it will trigger our [automatic tests](https://jenkins.zende.sk/view/Embeddables/job/widget_all_staging_jobs/) to run in staging.

#### LiveChat popout

This can be deployed with the `Deploy Popout (Staging)` stage. There is no build stage for this as it is a static html file that is simply deployed to the latest version. This can be found at:

```
https://static-staging.zdassets.com/web_widget/latest/liveChat.html
```

### Production

#### Web Widget

When your change has been QA'd on staging you can then deploy the release to the `Release Production` stage. This will update the latest version to point to the released SHA.  This can be found at:

```
https://static.zdassets.com/web_widget/latest/web_widget.js
```

#### LiveChat popout

This can be deployed with the `Deploy Popout (Production)` stage. There is no build stage for this as it is a static html file that is simply deployed to the latest version. This can be found at:

```
https://static.zdassets.com/web_widget/latest/liveChat.html
```

#### Assets

In production the assets are served via the Cloudflare CDN.

The Web Widget's `web_widget.js` uses `Cache-Control` headers for smart cache invalidation. Specifically

```
cache-control:public, max-age=60, s-maxage=60
```

which means that every 60 seconds a conditional GET request is performed to check if a new version is available with a fresh `E-Tag`. If so the new copy will be downloaded, otherwise a locally cached copy will be used.

Make sure that [staging status](https://jenkins.zende.sk/view/StagingStatus/) tests are green and we are not in a [production freeze](https://zendesk.atlassian.net/wiki/display/ops/Production+Freeze) before deploying to production.

Deploys to production require a buddy. Please ping someone from Taipan via Slack [#team-taipan](https://zendesk.slack.com/messages/C0R1EJ3UP/) if you need a buddy.

## Recovery

If there is a problem with the deployed version you will need to rollback to the previous stable version via Samson. As mentioned earlier, you can very quickly re-deploy a working older release to the `Release Production` stage.
If the problem is going to take some time to fix also please revert your PR so that it's not holding up other deploys.

Please notify [#team-taipan](https://zendesk.slack.com/messages/C0R1EJ3UP/) if a rollback has occurred out of Melbourne hours.

We have a [runbook](https://zendesk.atlassian.net/wiki/display/rb/Embeddable+Runbook) to help diagnose common problems.

## Verification

- Test your changes on a production account.
- Keep an eye on our [health dashboards](https://app.datadoghq.com/screen/156652/taipan-health-dashboard) to make sure nothing is out of the ordinary. This dashboard shows anomaly data on metrics when they are below or above the regular thresholds. Note that it is normal to see occasional spikes in certain metrics that will appear as anomaly data, however, if any metrics are consistently abnormal it may be related to a recent deploy.
- Make sure our [Production Smoke tests](https://jenkins.zende.sk/view/Embeddables/job/widget_production_smoke_test/) pass.
