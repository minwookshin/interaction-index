# Publication configuration

The source is MIT-licensed and its canonical publication metadata is configured for `minwookshin/whatiuse`. The npm package remains private and unpublished.

## Reconfigure deliberately

If ownership or the repository name changes, update every canonical endpoint together:

```bash
npm run configure:publication -- --repo minwookshin/whatiuse
```

The command writes canonical HTTPS repository, issue tracker, security-advisory, homepage, and GitHub-registry install metadata while preserving `private: true`.

The public repository distributes the root shadcn registry and the canonical documentation deployment serves it at `https://whatiuse.minwookshin.com/r/{name}.json`. `public/r/manifest.json` records deterministic artifact, file, API, and token hashes for reviewable updates. Versioned artifacts live at `/r/v/<version>/{name}.json`, are locked against same-version rewrites, and are served with an immutable cache header. Consumers can also install `minwookshin/whatiuse/teum` directly through shadcn.

The unversioned HTTPS registry is a mutable pre-release channel. The versioned HTTPS path is the reproducible JSON boundary; a GitHub `v<version>` tag remains a separate repository-release claim and must not be implied before the tag exists. See `REGISTRY_UPDATES.md`.

`npm run build:package`, `npm run check:package`, and `npm run test:package` prepare and verify the private package boundary. `assemble:public-package` copies only that reviewed surface into a separate tarball whose manifest is publishable while the repository stays locked with `private: true`; `check:public-package` repeats npm dry-run, TypeScript, Vite, SSR, and hydration checks against those exact bytes.

Before any tagged package release, run the release-candidate workflow and close every mandatory item in `RELEASE_CHECKLIST.md`. GitHub Issues and private vulnerability reporting are the public feedback channels. The first `teum` beta must be bootstrapped by the maintainer with 2FA because a new package cannot use staged publishing before it exists. After bootstrap, configure `publish-npm.yml` as a stage-only trusted publisher, set the repository variable only after that trust is live, and approve every staged release with 2FA. Do not add a long-lived publish token.
