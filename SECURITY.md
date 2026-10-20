# Security Policy

## Supported version

Security fixes target the current production version at <https://tobyworld-game.vercel.app> and the current `main` branch. Older snapshots are not maintained separately.

## Report a vulnerability privately

Please do **not** open a public issue, discussion, or pull request containing vulnerability details, credentials, private data, or a working exploit.

The preferred intake is GitHub private vulnerability reporting through this repository's **Security → Report a vulnerability** action, if the feature is enabled. Its availability has not been verified for this private staging repository; verification and enablement are release blockers. Until then, use an established private maintainer channel to request secure reporting instructions. Until it is enabled, contact a ToadAid maintainer through an already established private channel and ask for a secure reporting route before sending technical details.

Include, once a private channel is confirmed:

- A concise description and likely impact.
- Affected URL, file, or commit.
- Reproduction steps or a minimal proof of concept.
- Browser/device details when relevant.
- Any suggested mitigation.

Please avoid accessing other users' data, degrading the live game, social engineering, automated traffic against production, or publishing details before maintainers have had a reasonable chance to respond.

## What to expect

Maintainers should acknowledge a private report, assess severity, coordinate a fix and disclosure plan, and credit the reporter if requested. Response times are not yet guaranteed; this is a volunteer community project.

## Scope notes

The game is a static PWA with local-only saves and no account, wallet, analytics, or server-side gameplay API. Relevant issues can still include unsafe external navigation, service-worker cache poisoning, dependency or deployment compromise, cross-site scripting, exposed credentials, and privacy regressions.
