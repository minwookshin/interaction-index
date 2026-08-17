# Security policy

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue.

Use the canonical repository's **Security** tab and **Report a vulnerability** to open a private report. Do not include exploit details in GitHub Issues. Include:

- the affected component and version;
- a minimal reproduction;
- the expected and observed behavior;
- the likely impact;
- any suggested mitigation;
- whether public disclosure has already occurred.

The maintainer will acknowledge a complete report, validate the affected versions, coordinate a fix, and agree on disclosure timing with the reporter. Exact response-time commitments will be added only after public maintenance capacity is established.

## Supported versions

Before `1.0`, only the latest pre-release candidate is eligible for security fixes. A stable release must publish its maintenance window before it is described as production-ready. Historical versioned registry artifacts remain available for reproducibility, but availability does not imply ongoing security support.

## Release and supply-chain controls

- GitHub Actions are pinned to full commit SHAs and updated through reviewed dependency pull requests.
- Checkout credentials are not persisted, and Pages or attestation identity permissions are isolated to the jobs that use them.
- Public install instructions pin the shadcn CLI. Versioned registry artifacts pin internal registry references to one release and external dependencies to exact resolved versions.
- Versioned registry directories are append-only and checked against `release/registry-history.json`; release-anchored versions are also compared byte-for-byte with their source commit.
- Package candidates contain exactly one tarball, a CycloneDX SBOM, a candidate manifest, and checksums. Attestation targets that exact tarball in a separate least-privilege job.
- npm publication remains disabled while the package is private. Verification or attestation is not a publication event.

## Scope

Security reports may include component behavior, dependency exposure, registry artifacts, documentation infrastructure, and the Sites worker. Product-specific misuse or vulnerabilities in unmodified third-party dependencies should be reported to the responsible upstream project.
