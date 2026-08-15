# Publication configuration

The source is MIT-licensed and its canonical publication metadata is configured for `minwookshin/interaction-index`. The npm package remains private and unpublished.

## Reconfigure deliberately

If ownership or the repository name changes, update every canonical endpoint together:

```bash
npm run configure:publication -- --repo minwookshin/interaction-index
```

The command writes canonical HTTPS repository, issue tracker, security-advisory, homepage, and GitHub-registry install metadata while preserving `private: true`.

The public repository distributes the root shadcn registry and GitHub Pages hosts the generated HTTPS registry at `https://minwookshin.github.io/interaction-index/r/{name}.json`. Consumers can also install `minwookshin/interaction-index/interaction-index` directly through shadcn.

Before any tagged package release, run the release-candidate workflow and close every mandatory item in `RELEASE_CHECKLIST.md`. GitHub Issues and private vulnerability reporting are the public feedback channels; npm publication remains a separate explicit decision.
