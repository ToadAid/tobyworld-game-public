# Full-Game Public Release Checklist — PRIVATE REVIEW

**Status: BLOCKED. This is not authorization to publish.**

The full game was copied from private `ToadAid/tobyworld-game` at `27a14ac8b59ef883b7c4ae3c12e735eeb319c750` with 2,943 exact path/blob matches in the P5 audit (2,925 assets, 3 data files, 15 runtime files). This confirms file-level parity, **not browser parity or permission to distribute the art**. The source repository's full Git history was deliberately excluded.

## Before changing repository visibility

- [ ] **Code-license authority:** establish that ToadAid and code contributors authorize MIT distribution of their eligible code and code-oriented documentation.
- [ ] **Image and lore rights:** document appropriate creator or collection licenses/grants and conditions for the canonical deed images, 2,869 derived thumbnails, canonical descriptions and metadata, imagined artwork, Keeper and character art, title images, audio, and other non-code assets.
- [ ] **Reachable Git history:** inspect all branches, tags, commits and blobs, plus workflow artifacts, for secrets, identifying information and uncleared assets. Changing the default branch or deleting branches later does not prove historical content was removed.
- [ ] **Clean public path if needed:** if any reachable Git object cannot be cleared, prepare a **fresh, history-free** publication repository rather than making the current staging repository public.
- [ ] **Developer verification:** on a fresh checkout run `npm run check`, `npm test`, and `npm run audit:sandboxes` with green CI.
- [ ] **Browser parity:** verify the title screen, all twelve campaign stages, 2,869-deed explorer and sandbox behavior, audio, PWA/fullscreen, controls, settings and saved progress against the live game.
- [ ] **Physical mobile QA:** test with real iOS and Android devices following [PHYSICAL_DEVICE_QA.md](PHYSICAL_DEVICE_QA.md); record evidence and remaining issues.
- [ ] **Security and repo controls:** confirm GitHub private vulnerability reporting is enabled, establish branch protections or equivalent safeguards, review dependency/secret scans and artifact exposures.
- [ ] **Separate human publication approval:** explicitly authorize any visibility change only after written rights evidence and all required checks are reviewed.

## Rights are distinct from accessibility

Canonical deeds are indexed on Base, and their metadata and images may be retrievable through IPFS and OpenSea. Those facts support provenance and retrievability but do **not**, by themselves, grant copyright permission to redistribute NFT artwork through GitHub.

The private source repo, its Vercel deployment, and its historical commits are not modified by P9.
