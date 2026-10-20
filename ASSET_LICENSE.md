# Asset, Lore, and Licensing Boundaries

This document is an inventory, not a grant of rights. It prevents the proposed MIT code license from being mistaken for permission to reuse Tobyworld lore, names, characters, metadata, or artwork.

## Scope of the proposed MIT license

Subject to human approval and contributor authority, `LICENSE` is intended to cover ToadAid-owned source code and code-oriented documentation: `index.html`, `styles.css`, `app.js`, `sw.js`, `src/`, `tests/`, `tools/`, the PWA manifest, and original repository process documentation.

The MIT license does **not** cover visual assets, canonical metadata/lore, trademarks, character identities, or third-party material unless a file-specific notice expressly says otherwise.

## Inventory

| Category | Repository paths | Recorded provenance | Redistribution status |
|---|---|---|---|
| ToadAid gameplay and UI code | `index.html`, `styles.css`, `app.js`, `sw.js`, `src/`, `tests/`, `tools/` | Developed for this community game | Proposed MIT, pending human confirmation that all contributors can grant it |
| ToadAid campaign design and adaptation text | `CAMPAIGN_STORY.md`, `data/campaign.json`, adapted dialogue/rules in source | Clearly labeled community-created mechanics and narrative | Proposed MIT only where ToadAid owns the text; underlying names and lore remain excluded |
| Project preview | `docs/game-preview.svg` | Original abstract vector composed for documentation; no embedded canonical game artwork | Proposed MIT with code/documentation, subject to contributor approval |
| Canonical campaign deed images | `assets/deed-*.png` | Twelve 1254px/1536px canonical or original deed references; hashes recorded in `data/owned-deeds.json` | **Unresolved. All rights reserved unless the respective owner grants permission.** |
| Canonical archive thumbnails | `assets/deed-thumbnails/*.webp` | 2,869 512px derivatives generated from the canonical archive | **Unresolved. Derivative conversion does not establish redistribution rights.** |
| Canonical metadata index | `data/lore-lands.json` | Generated from 2,869 canonical metadata records; includes names, descriptions, signs, and IPFS references | **Unresolved. Do not assume collection ownership grants a redistribution license.** |
| ToadAid-imagined land masters | `assets/imagined-*.png` | Twelve expanded Lore Land interpretations identified in the local provenance manifest | ToadAid creation is asserted by project records, but generation/source terms and underlying canonical rights are not documented; **not cleared for public reuse** |
| Responsive imagined derivatives | `assets/stage-art/*.webp` | Generated locally from `assets/imagined-*.png` by `tools/build-stage-art.py` | Same unresolved status as the masters |
| Character and title artwork | `assets/toby.png`, `assets/taboshi.png`, `assets/patience.png`, `assets/tobyworld-trio.png` | Existing project assets; no embedded author, generation method, license, or written permission record found | **Unresolved; not licensed by MIT** |
| Keeper artwork | `assets/keepers/*.png` | Game-ready interpretations with dimensions, hashes, colors, and reference deeds in `assets/keepers/manifest.json` | Technical provenance exists, but authorship/generation terms and redistribution permission are incomplete; **not cleared for public reuse** |
| Canon source summary | `canon-sources/2026-08-18-genesis-forge-closed.md` | Citation and ToadAid summary of a linked Toadgod post; verbatim transcript removed from the release candidate | Source post remains the author's work; repository summary does not grant reuse rights to the original |
| Generated browser audio | `src/audio.mjs` | Synthesized at runtime with Web Audio; no bundled samples | Proposed MIT as ToadAid-owned code, pending contributor confirmation |

`data/owned-deeds.json` records technical hashes, dimensions, roles, and source filenames. Those records help detect drift but are not evidence of copyright ownership or a redistribution license.

## Canon and marks

Tobyworld, Toby, Toadgod, Toadgang, Taboshi, Patience, Keepers, Lore Land Deeds, sign names, and related lore may be protected names, characters, marks, or creative works belonging to their respective owners. Their appearance here is descriptive and community-oriented and does not imply endorsement, transfer of ownership, or permission for commercial reuse.

## Contribution requirements

Every new visual, audio recording, font, lore excerpt, or other non-code asset needs:

1. Creator or source.
2. Creation date and method, including generation tool/model when applicable.
3. Source references and derivative chain.
4. Explicit redistribution license or written permission.
5. Any attribution, modification, commercial-use, or model-output restrictions.

Do not add an asset when any of those answers are unknown. Owning a token, NFT, print, or source file does not by itself prove permission to redistribute the underlying work.

## Public-release gate

The full-game asset set in this PRIVATE repository is **not cleared for public open-source redistribution**. Before publication, obtain and archive written permission for every shipped non-code category, or prepare a clean public edition that:

- omits canonical images, archive thumbnails, full canonical descriptions, and unclear character/generated assets;
- uses ToadAid-owned or permissively licensed replacement visuals with recorded provenance;
- preserves a playable campaign using abstract shapes, CSS/canvas art, and local example data; and
- optionally accepts a separately distributed, permission-cleared asset pack at runtime.

Until one of those paths is completed, copying the repository's code may be allowed under the proposed MIT terms, but copying its asset bundle is not authorized by this repository.
## Private staging and public history boundary

This repository currently includes the actual full game and all runtime imagery on private `main`. It is not a cleared publication. The separate three-world `public-edition/` experiment exists only in the private production source repository and is **not** part of this repository.

**Do not change visibility** without recorded creator/contributor rights approval and a full reachable Git-history review. If any staged asset remains uncleared, use a newly created, audited, history-free public repository instead of relying on branch deletion. See [PUBLIC_RELEASE_CHECKLIST.md](PUBLIC_RELEASE_CHECKLIST.md) and [PRIVATE_RELEASE_GATE.md](PRIVATE_RELEASE_GATE.md).
