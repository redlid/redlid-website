# Redlid Website
### Hosted in AWS S3

# Website Auto Deployment
The production website (**redlid.co.nz**) can be released automatically at a scheduled date and time. A chosen pull request is merged into `master`, built, deployed to S3, and announced in Slack.
## How it works
```
AWS EventBridge Scheduler  (fires once at the scheduled NZ date/time)
        │
        ▼
AWS Lambda: redlid-website-auto-deployment
        │  calls GitHub API (workflow_dispatch on master)
        ▼
GitHub Actions: .github/workflows/scheduled-deploy-s3.yml
        │  1. merge PR #<PR_NUMBER_FOR__AUTO_DEPLOYMENT> into master
        │  2. build site
        │  3. sync to s3://redlid.co.nz + invalidate CloudFront
        ▼
Slack #redlid  (success or failure message)
```
- The **schedule** (date/time) is managed in the `redlid/iac` Terraform repo.
- **What gets released** (which PR) is managed in this repo's GitHub Actions variables.
- The workflow has no cron of its own. It runs only when AWS triggers it, or when someone runs it manually.
## Workflows in this repo
| Workflow | File | Trigger | Deploys to |
|---|---|---|---|
| Scheduled Deploy to S3 | `scheduled-deploy-s3.yml` | AWS Lambda at scheduled time, or manual | Production (`redlid.co.nz`) only, after merging the configured PR |
| Deploy to S3 | `deploy-s3.yml` | Manual only | `dev` or `prod` (choose at run time) |
## Scheduling a release
1. **Prepare the PR.** Make sure it's approved and its checks pass. Branch protection on `master` must allow the merge.
2. **Set the PR number.** Go to **Settings → Secrets and variables → Actions → Variables** and set:
   | Variable | Value |
   |---|---|
   | `PR_NUMBER_FOR__AUTO_DEPLOYMENT` | The PR number to release, e.g. `42` |
3. **Set the date and time** in the `redlid/iac` repo, in `environments/dev/terraform.tfvars`:
   ```hcl
   website_deploy_schedule_datetime = "2026-12-10T16:00:00"   # NZ local time, no timezone suffix
   website_deploy_schedule_state    = "ENABLED"
   ```
   Then apply it:
   ```
   make plan-dev
   make apply-dev
   ```
   > Although it runs from the **dev** Terraform stack, this schedule releases to **production**. It exists only in the dev stack.
## Other actions
| Need | How |
|---|---|
| Release immediately | **Actions → Scheduled Deploy to S3 → Run workflow** (branch `master`) |
| Cancel a scheduled release | In `redlid/iac`, set `website_deploy_schedule_state = "DISABLED"`, then `make apply-dev` |
| Change the release time | In `redlid/iac`, update `website_deploy_schedule_datetime`, then `make apply-dev` |
| Replace the GitHub token used by AWS | AWS Secrets Manager → `REDLID_GH_TOKEN` (region `ap-southeast-6`). Save as `{"token": "ghp_..."}` |
## Configuration used by the workflow
**Repository variables**
| Name | Purpose |
|---|---|
| `PR_NUMBER_FOR__AUTO_DEPLOYMENT` | PR merged and released by the scheduled deployment |
**Repository secrets**
| Name | Purpose |
|---|---|
| `AWS_ACCESS_KEY` / `AWS_SECRET_KEY` | Upload to S3 and invalidate CloudFront |
| `SLACK_TOKEN` | Post deployment results to `#redlid` |
**GitHub token for the AWS trigger** (stored in AWS, not in this repo)
- Classic personal access token with the `repo` scope.
- The token owner must have **Write** access (or higher) to this repository.
- Stored in AWS Secrets Manager as `REDLID_GH_TOKEN`.
## Behaviour notes
- If the PR is **already merged**, the workflow skips the merge and still deploys.
- If the PR is **closed (not merged)**, or the variable is empty, the run fails and nothing is deployed.
- Runs never overlap. A second run waits until the current one finishes, so a deploy is never cut off partway through.
- The site is synced with `--delete`, so files not in the build output are removed from the bucket.
## Troubleshooting
| Symptom | Where to look | Likely cause |
|---|---|---|
| Slack shows **FAILED** | Link in the Slack message → GitHub Actions run log | Merge blocked by branch protection, build error, or AWS credentials |
| No run appears in GitHub Actions | AWS CloudWatch logs: `/aws/lambda/redlid-website-auto-deployment` | GitHub token missing scope, expired, or lacking repo access (HTTP 401/403/404) |
| Lambda log shows nothing at the scheduled time | AWS SQS queue `redlid-website-auto-deployment-scheduler-dlq` | Schedule disabled, date in the past, or Scheduler couldn't invoke the Lambda |
| Failures after retries | AWS SQS queue `redlid-website-auto-deployment-lambda-failures` | GitHub rejected the request. The message contains the error |
All AWS resources are in region **`ap-southeast-6`**.
## Don't
- Don't add a `schedule:` cron to `scheduled-deploy-s3.yml`. AWS is the only scheduler.
- Don't add inputs to the `workflow_dispatch` trigger. The AWS trigger sends none, and GitHub would reject the call.
- Don't rename or move the workflow file without updating `website_deploy_workflow_file` in `redlid/iac`.

