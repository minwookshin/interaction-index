# Release process

Interaction Index uses verified, maintainer-approved releases. A passing workflow is evidence, not permission to publish.

## Candidate

1. Update `package.json`, `CHANGELOG.md`, `MIGRATIONS.md`, compatibility evidence, and the release checklist.
2. Run `npm run quality`, `npm run test:consumer`, the browser matrix, accessibility checks, pilot tests, and visual regression locally.
3. Trigger the **Release candidate** workflow with the exact version.
4. Review its build, registry, performance report, screenshots, and browser artifacts.

## Publish

1. Confirm the canonical repository, issue tracker, homepage, registry install path, and private security-advisory channel.
2. Create a signed or annotated version tag from the verified commit.
3. Generate release notes from `.github/release.yml`, then add breaking changes and migrations by hand.
4. Publish a GitHub prerelease for `0.x` alphas.
5. Keep the npm package private until package distribution is separately approved.

## Rollback

Do not rewrite a published tag. Mark the affected release, document the defect, restore the last verified registry artifact, and issue a new patch candidate.
