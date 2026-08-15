# Release process

Interaction Index uses verified, maintainer-approved releases. A passing workflow is evidence, not permission to publish.

## Candidate

1. Update `package.json`, `CHANGELOG.md`, `MIGRATIONS.md`, compatibility evidence, and the release checklist.
2. Run `npm run build:registry`, verify the versioned release remains byte-for-byte locked, save the previous manifest, and review `npm run diff:registry -- --from <manifest>`.
3. Run `npm run quality`, `npm run test:consumer`, `npm run test:consumer:upgrade`, `npm run test:package`, the browser matrix, accessibility checks, pilot tests, and visual regression locally.
4. Trigger the **Release candidate** and **Package candidate** workflows with the exact version.
5. Review the build, registry manifest, package contents, provenance attestation, performance report, screenshots, and browser artifacts.

## Publish

1. Confirm the canonical repository, issue tracker, homepage, registry install path, and private security-advisory channel.
2. Create a signed or annotated version tag from the verified commit. Never claim the tagged registry address before the tag exists.
3. Generate release notes from `.github/release.yml`, then add breaking changes and migrations by hand.
4. Publish a GitHub prerelease for `0.x` alphas.
5. Keep the npm package private until package distribution is separately approved. A package candidate and attestation are not an npm publication.

## Rollback

Do not rewrite a published tag. Mark the affected release, document the defect, restore the last verified registry artifact, and issue a new patch candidate.
