# Security Policy

## Private reporting

Do **not** open a public issue, discussion, or pull request containing vulnerability details, credentials, private data, or a working exploit.

Before public launch, maintainers must enable GitHub private vulnerability reporting for the new repository and verify the **Security → Report a vulnerability** flow. Until that exists, contact a ToadAid maintainer through an already established private community channel and ask for a secure route before sending technical detail.

Once a private route is confirmed, include a concise impact summary, affected URL/file/commit, reproduction steps, browser or device details, and a suggested mitigation if available. Avoid accessing other users' data, degrading a live service, automated production traffic, or disclosure before maintainers can respond.

## Scope

This is a static PWA with local-only saves and no account, wallet, analytics, server-side gameplay API, or runtime package dependency. Relevant reports can still include unsafe navigation, service-worker cache issues, cross-site scripting, exposed credentials, privacy regressions, and deployment compromise.
