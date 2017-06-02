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

| Stage                             | Pods          | Notes                                                                   |
|:----------------------------------|:--------------|:------------------------------------------------------------------------|
| Release Bucket                    | S3 Bucket     | Static assets are built here and then deployed to an S3 bucket          |
| Master (from Release Bucket)      | 98, 99        | Releases deployed to Release Bucket will automatically be deployed here |
| Staging (from Release Bucket)     | 100, 101, 999 | Used by QA, automated and manual tests happen here                      |
| Production (from Release Bucket)  | 3-14          | All production pods                                                     |

The rest of the stages aren't often used, specifically the `From Source` stages. It's preferred that releases are deployed to `Release Bucket` and then to `Staging (from Release Bucket)` or `Production (from Release Bucket)` to allow for faster rollbacks in the case of an emergency.

## Deployment Process

Pull Requests are merged into `master` branch after receiving two 👍s. At lease one of these must come from a member of [#team-taipan](https://zendesk.slack.com/messages/C0R1EJ3UP/).

### Release Bucket

In order to deploy changes to staging or production once a PR is merged, you will need to wait for the next release to be cut and appear in Samson and then Deploy to the `Release Bucket` stage.

This stage will perform a production build of embeddable framework producing a number of static javascript files. These files will then be uploaded to an S3 bucket in a directory named after the release (`V<release_num>`). This allows us to perform the slow build portion of deployment once for each release, and then deploy to staging or production hosts very quickly by simply copying static assets. If a roll-back is required, we can target an earlier release and very quickly deploy it to production.

You can view the contents of the bucket at https://console.aws.amazon.com/s3/buckets/zendesk-embeddable-framework/?region=us-west-1&tab=overview. Note that you will need DevOps privileges to access the bucket via the aws console.

### Master

Once a release is deployed to `Release Bucket`, it will automatically be deployed to `Master (from Release Bucket)` by Samson.

### Staging

As mentioned earlier, once a release is deployed to `Release Bucket`, you can then deploy the release to the `Staging (from Release Bucket)` stage. This will copy the static assets onto the staging hosts which can be accessed via

```
https://assets.zd-staging.com/embeddable_framework/main.js
```

Once the deploy is finished it will trigger our [automatic tests](https://jenkins.zende.sk/view/Embeddables/job/widget_all_staging_jobs/) to run in staging.

### Production

When your change has been QA'd on staging you can then deploy the release to the `Production (from Release Bucket)` stage. This will copy the static assets onto the production hosts which can be accessed via

```
https://assets.zendesk.com/embeddable_framework/main.js
```

In production the assets are served via the EdgeCast CDN, which uses our hosts on POD7 as the origin.

The Web Widget's `main.js` uses `Cache-Control` headers for smart cache invalidation. Specifically

```
cache-control:public, max-age=60, s-maxage=60
cache-control:max-age=60
```

which means that every 60 seconds a conditional GET request is performed to check if a new version is available with a fresh `E-Tag`. If so the new copy will be downloaded, otherwise a locally cached copy will be used.

Make sure that [staging status](https://jenkins.zende.sk/view/StagingStatus/) tests are green and we are not in a [production freeze](https://zendesk.atlassian.net/wiki/display/ops/Production+Freeze) before deploying to production.

Deploys to production require a buddy. Please ping someone from Taipan via Slack [#team-taipan](https://zendesk.slack.com/messages/C0R1EJ3UP/) if you need a buddy.

## Recovery

If there is a problem with the deployed version you will need to rollback to the previous stable version via Samson. As mentioned earlier, you can very quickly re-deploy a working older release to the `Production (from Release Bucket)` stage.
If the problem is going to take some time to fix also please revert your PR so that it's not holding up other deploys.

Please notify [#team-taipan](https://zendesk.slack.com/messages/C0R1EJ3UP/) if a rollback has occurred out of Melbourne hours.

We have a [runbook](https://zendesk.atlassian.net/wiki/display/rb/Embeddable+Runbook) to help diagnose common problems.

## Verification

- Test your changes on a production account.
- Keep an eye on our [health dashboards](https://app.datadoghq.com/screen/156652/taipan-health-dashboard) to make sure nothing is out of the ordinary.
- Make sure our [Production Smoke tests](https://jenkins.zende.sk/view/Embeddables/job/widget_production_smoke_test/) pass.
