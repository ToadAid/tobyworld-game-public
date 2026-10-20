# Contributing to Paths of Patience

Welcome to the pond. Contributions from first-time maintainers, artists, players, translators, accessibility reviewers, and experienced game developers are all valuable here.

## Before you begin

1. Read the project boundaries in [`README.md`](README.md) and [`ASSET_LICENSE.md`](ASSET_LICENSE.md).
2. Search existing issues before opening a new one.
3. For a substantial feature or new artwork direction, open a proposal first so nobody spends time on work that cannot be merged.
4. Never put credentials, personal data, private archive paths, or unlicensed source material in an issue or pull request.
5. Report security vulnerabilities privately as described in [`SECURITY.md`](SECURITY.md).

## Good ways to help

- Report a reproducible gameplay, layout, audio, save, or PWA bug.
- Suggest a focused mechanic that keeps the land artwork central and does not require a wallet, login, analytics, or advertising.
- Improve keyboard, touch, screen-reader, color, contrast, reduced-motion, or cognitive accessibility.
- Translate interface text while preserving the boundary between canonical terms and ToadAid adaptations.
- Clarify documentation, test instructions, or contributor onboarding.
- Propose a Lore Land interpretation that leaves canonical deed records unchanged and labels new mechanics, dialogue, and narrative as adaptations.
- Contribute artwork only with source/provenance notes and explicit redistribution terms.

## Reporting a bug

Open a GitHub issue with:

- What you expected and what happened.
- Exact steps to reproduce it.
- Browser, operating system, viewport or device size, and input method.
- The deed number and whether you used campaign, test, lookup, or sandbox mode.
- Whether reduced motion, fullscreen/PWA mode, sound, or haptics were enabled.
- A screenshot or short recording when it is safe and useful.

Do not include wallet details, private keys, session tokens, personal addresses, or sensitive security evidence.

## Local workflow

Create a branch from the latest `main`, then serve the repository with Python:

```bash
python3 -m http.server 7777 --bind 127.0.0.1
```

Open <http://127.0.0.1:7777>. Before submitting a pull request, run:

```bash
npm run check
npm test
npm run audit:sandboxes
git diff --check
```

Keep commits focused. Do not force-push shared branches, rewrite project history, commit local build archives, or mix unrelated formatting into a feature.

## Pull-request checklist

- Explain the player-facing change and why it belongs in the game.
- List the exact checks and viewports you tested.
- State clearly whether physical-device testing was performed.
- Include before/after screenshots for visible changes when cleared assets permit them.
- Confirm campaign saves and sandbox isolation remain intact when relevant.
- Update `README.md` and relevant public-facing documentation when behavior changes.
- Identify every added or changed visual/audio/lore asset and its provenance and redistribution permission.

## Canonical records and adaptations

Do not edit canonical source values to fit a gameplay idea. Canonical deed number and five-sign records remain source references. New maps, dialogue, rules, stories, and visual interpretations must be described as community-created adaptations. If a source is ambiguous, preserve the ambiguity and ask for review.

By contributing, you confirm that you have the right to submit your work under the repository's applicable terms. Code contributions must be your original or appropriately licensed work and are submitted under the MIT code license upon project acceptance. Do not add third-party source material you cannot legally license. Artwork and lore contributions need an explicit, file-specific license or permission statement; the MIT code license does not automatically cover them.
