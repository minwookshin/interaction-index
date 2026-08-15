# Publication configuration

The source is MIT-licensed and its canonical publication metadata is configured for `minwookshin/interaction-index`. The npm package remains private and unpublished.

## Reconfigure deliberately

If ownership or the repository name changes, update every canonical endpoint together:

```bash
npm run configure:publication -- --repo minwookshin/interaction-index
```

The command writes canonical HTTPS repository, issue tracker, security-advisory, homepage, and GitHub-registry install metadata while preserving `private: true`.

The public repository distributes the root shadcn registry and GitHub Pages hosts the generated HTTPS registry at `https://minwookshin.github.io/interaction-index/r/{name}.json`. `public/r/manifest.json` records deterministic artifact, file, API, and token hashes for reviewable updates. Versioned artifacts live at `/r/v/<version>/{name}.json`, are locked against same-version rewrites, and are served with an immutable cache header. Consumers can also install `minwookshin/interaction-index/interaction-index` directly through shadcn.

The unversioned HTTPS registry is a mutable alpha channel. The versioned HTTPS path is the reproducible JSON boundary; a GitHub `v<version>` tag remains a separate repository-release claim and must not be implied before the tag exists. See `REGISTRY_UPDATES.md`.

`npm run build:package`, `npm run check:package`, and `npm run test:package` prepare and verify the private package tarball without publishing it. The package candidate workflow can attest that tarball in GitHub Actions. It has no publish step and no npm credential.

Before any tagged package release, run the release-candidate workflow and close every mandatory item in `RELEASE_CHECKLIST.md`. GitHub Issues and private vulnerability reporting are the public feedback channels; npm publication remains a separate explicit decision. If npm publication is later approved, configure npm trusted publishing for the exact workflow and keep provenance enabled. Do not add a long-lived publish token by default.
