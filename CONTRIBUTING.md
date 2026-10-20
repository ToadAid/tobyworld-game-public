# Contributing

Welcome. First-time contributors, players, artists, translators, accessibility reviewers, and game developers all belong here.

## Before opening work

1. Read [README.md](README.md), [ASSET_LICENSE.md](ASSET_LICENSE.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
2. Search existing issues and open a short proposal before a large feature or new art direction.
3. Never post credentials, private data, unreleased archives, or vulnerability details in an issue or pull request.
4. Keep canonical source claims separate from community-created ideas. This sample uses invented world data and does not alter canonical records.

## Good ways to help

- Report reproducible gameplay, layout, audio, save, gamepad, fullscreen, or PWA bugs.
- Improve keyboard, touch, screen-reader, contrast, reduced-motion, and cognitive accessibility.
- Translate interface text while preserving rights and adaptation notices.
- Improve tests, documentation, performance, or beginner onboarding.
- Propose new sample-world mechanics and interpretations without presenting them as canonical lore.
- Contribute original artwork only with a creator record and explicit redistribution license.

## Local workflow

Serve the project directly:

```bash
python3 -m http.server 8080
```

Before a pull request, run:

```bash
npm run check
npm test
npm run audit:samples
git diff --check
```

Keep commits focused. In your PR, explain the player-facing change, list exact browsers/viewports tested, distinguish emulation from physical-device testing, and identify the provenance and license of every new non-code asset.

By contributing, you confirm that you have the right to submit the work under the applicable project terms. Code is expected to be eligible for MIT; visual, audio, lore, and data contributions require file-specific rights evidence.
