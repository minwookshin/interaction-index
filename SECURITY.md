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

Before `1.0`, only the latest alpha is eligible for security fixes. A stable release must publish its maintenance window before it is described as production-ready.

## Scope

Security reports may include component behavior, dependency exposure, registry artifacts, documentation infrastructure, and the Sites worker. Product-specific misuse or vulnerabilities in unmodified third-party dependencies should be reported to the responsible upstream project.
