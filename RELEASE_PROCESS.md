# Release process

Teum uses verified, maintainer-approved releases. A passing workflow is evidence, not permission to publish.

## Candidate

1. Update `package.json`, `CHANGELOG.md`, `MIGRATIONS.md`, compatibility evidence, and the release checklist.
2. Run `npm run build:registry`, verify the versioned release remains content-locked with its deterministic pinned-dependency rewrite, save the previous manifest, and review `npm run diff:registry -- --from <manifest>`.
3. Run `npm run quality`, `npm run test:consumer`, `npm run test:consumer:upgrade`, `npm run test:package`, the browser matrix, accessibility checks, pilot tests, and visual regression locally.
4. Trigger the **Release candidate** and **Package candidate** workflows with the exact version.
5. Review the build, registry manifest, package contents, provenance attestation, performance report, screenshots, and browser artifacts.

## Publish

1. Confirm the canonical repository, issue tracker, homepage, registry install path, and private security-advisory channel.
2. Create a signed or annotated version tag from the verified commit. Never claim the tagged registry address before the tag exists.
3. Generate release notes from `.github/release.yml`, then add breaking changes and migrations by hand.
4. Publish a GitHub prerelease for the public beta only after its assets and tag identify the verified commit.
5. Bootstrap the first npm beta only from the verified public-package tarball with maintainer 2FA. After the package exists, configure the exact GitHub workflow as a stage-only trusted publisher before allowing automated package updates.
6. Publish prerelease packages under the `beta` dist-tag. Do not move `latest` until the v1 evidence gate passes.

## Rollback

Do not rewrite a published tag. Mark the affected release, document the defect, restore the last verified registry artifact, and issue a new patch candidate.
