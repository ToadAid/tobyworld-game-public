# Asset, Lore, and Licensing Boundaries

This is a public repository. This document separates the MIT license for eligible original ToadAid software and code documentation from the distinct rights in Tobyworld lore, names, characters, metadata, artwork, and third-party material. A public GitHub download is not a blanket license for those assets.

## MIT code license scope

The repository's `LICENSE` applies to eligible original ToadAid-owned source code and code-oriented documentation: `index.html`, `styles.css`, `app.js`, `sw.js`, `src/`, `tests/`, `tools/`, the PWA manifest, and original repository process documentation.

The MIT license does **not** grant permissions over visual assets, canonical metadata/lore, trademarks, character identities, or third-party material unless the respective rights holder or a file-specific notice expressly licenses them. Contributors must have authority to license what they submit.

## Inventory

| Category | Repository paths | Recorded provenance | Redistribution status |
|---|---|---|---|
| ToadAid gameplay and UI code | `index.html`, `styles.css`, `app.js`, `sw.js`, `src/`, `tests/`, `tools/` | Developed for this community game | MIT for eligible ToadAid-owned code; contributors license only what they own or may authorize |
| ToadAid campaign design and adaptation text | `CAMPAIGN_STORY.md`, `data/campaign.json`, adapted dialogue/rules in source | Clearly labeled community-created mechanics and narrative | MIT only for ToadAid-owned original text; underlying names and lore remain excluded |
| Project preview | `docs/game-preview.svg` | Original abstract vector composed for documentation; no embedded canonical game artwork | MIT if original and ToadAid-owned; no third-party artwork embedded |
| Canonical campaign deed images | `assets/deed-*.png` | Twelve 1254px/1536px canonical or original deed references; hashes recorded in `data/owned-deeds.json` | Separate rights; no public reuse license documented in this repository |
| Canonical archive thumbnails | `assets/deed-thumbnails/*.webp` | 2,869 512px derivatives generated from the canonical archive | Separate rights; thumbnail generation is not itself a reuse license |
| Canonical metadata index | `data/lore-lands.json` | Generated from 2,869 canonical metadata records; includes names, descriptions, signs, and IPFS references | Separate rights; collection/token ownership alone does not license description text |
| ToadAid-imagined land masters | `assets/imagined-*.png` | Twelve expanded Lore Land interpretations identified in the local provenance manifest | ToadAid creation is reported in project records, but underlying canonical rights and generation/source terms require independent review before reuse |
| Responsive imagined derivatives | `assets/stage-art/*.webp` | Generated locally from `assets/imagined-*.png` by `tools/build-stage-art.py` | Same reuse terms and uncertainties as the masters |
| Character and title artwork | `assets/toby.png`, `assets/taboshi.png`, `assets/patience.png`, `assets/tobyworld-trio.png` | Existing project assets; no embedded author, generation method, license, or written permission record found | No separate reuse license documented here; not covered by MIT |
| Keeper artwork | `assets/keepers/*.png` | Game-ready interpretations with dimensions, hashes, colors, and reference deeds in `assets/keepers/manifest.json` | Technical provenance exists; authorship, model/source terms and reuse permissions are not fully documented in this repository |
| Canon source summary | Original private production source (not included here) | Referenced Toadgod post and ToadAid summary | Original author retains rights; no redistribution license for the source post is implied |
| Generated browser audio | `src/audio.mjs` | Synthesized at runtime with Web Audio; no bundled samples | MIT for original code to the extent ToadAid/contributors own the rights |

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

## Reusing artwork, metadata, and lore

This public repository contains the complete browser runtime, including images and metadata used by the game. These files being publicly viewable does **not** mean their creators have licensed them under MIT, Creative Commons, or any other open-content license. The repository does not document a comprehensive transferable reuse grant for the non-code categories above.

Before copying, remixing, selling, or redistributing any non-code material independently, check the applicable creator or collection terms and obtain the rights needed for the intended use. Anyone with first-hand rights information or an ownership concern should contact a ToadAid maintainer through an established channel so provenance and terms can be corrected.

## Publication status

**PUBLIC GitHub repository.** Prior private-staging notices and release checklists have been retired from the current `main` documentation because the repository is already public. Historical Git commits and older branches may still contain those records. Public release and ownership/permission of creative assets are distinct facts.

The original production source repository and the Vercel game deployment are separate from this GitHub documentation update.
