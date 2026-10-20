# Clean-Edition Release Audit

Audit date: 2026-10-19

Status: privately staged release candidate awaiting human approval and final browser/publication checks

## Scope and architecture

This directory was created as a new, explicit clean-edition source tree. It does not import runtime code, data, images, audio, or build output from the production game. It contains three original sample worlds, procedural Canvas/SVG visuals, Web Audio synthesis, local saves, keyboard/touch/gamepad input, fullscreen, and a same-origin service worker.

The clean export process copies only files named in an allowlist. It excludes the parent `.git` directory, production assets, canonical metadata, internal documents, local paths, credentials, and the production save keys.

## Security findings

- No package dependencies or install scripts are present.
- Runtime URL inspection finds only three user-initiated community links; no automatic third-party fetch is implemented.
- The app has no wallet, authentication, analytics, ads, remote font, IPFS gateway, API key, or private-network dependency.
- Repository-content and history secret scanning passed on the final private staging snapshot and must be rerun immediately before publication.
- GitHub branch protection and rulesets are unavailable while this user-owned repository remains private on its current plan. Private vulnerability reporting is available only after publication. These controls must be enabled and verified after the required plan/visibility boundary and before announcement.

## Rights decision

Only original code, hand-authored SVG geometry, procedural Canvas scenery, synthesized Web Audio, and invented sample-world metadata are included. Canonical deed imagery and metadata, imagined Lore Land images, character art, Keeper art, derived thumbnails, and undocumented community assets are excluded. See [ASSET_LICENSE.md](ASSET_LICENSE.md).

The MIT license is proposed for eligible ToadAid-owned software and original included materials, subject to human confirmation of contributor authority. Referenced names and marks remain outside that grant.

## Verification record

The following checks were run against the candidate and its allowlist export. Do not interpret an unchecked item as a pass.

- [x] `npm run check`
- [x] `npm test` (19 tests across five test files passed, including pause/resume safety)
- [x] `npm run audit:samples` (3/3 graphs passed, including mandatory Yield chokepoints)
- [x] `git diff --check`
- [x] exact `python3 -m http.server 8080` workflow; all fourteen requested runtime routes/assets returned HTTP 200
- [ ] title, sample-world play, objective completion, save/reload, audio, keyboard, touch emulation, fullscreen, community links, PWA assets, console, and network inspection
- [ ] physical-device testing (optional limitation, must be reported truthfully)
- [x] final clean-export targeted secret/path/rights scan (no high-confidence credential or personal-machine path match; only documented community/local/W3C URLs found)
- [x] authenticated fresh clone from the private staging repository; clean-edition checks, tests, sample audit, whitespace check, and manifest verification passed
- [ ] unauthenticated clone from the approved public URL (publication-stage check)

The clean export includes a generated manifest, and every listed file verified. The source-repository review package records the final file count, byte count, and manifest digest. Its only raster image is the cleared share preview rendered directly from the included hand-authored SVG. No symlink, nested `.git`, or generated dependency directory is present.

The P2R-R1 exporter now validates the source tree against a literal reviewed file allowlist before touching an existing output, copies files individually, permits only the checksum-pinned preview PNG as binary content, scans every approved file for high-confidence credentials and personal paths, and verifies the completed export against its SHA-256 manifest. Negative tests prove that unexpected files, injected credentials, nested Git data, symlinks, binary content in text paths, and PNG tampering fail closed.

Pause/resume regression tests cover Escape cancellation, explicit resume, unexpected dialog closing, restart/title close intents, non-resumable states, focus restoration, and suppression of gameplay shortcuts while a dialog is open.

Interactive browser QA remains pending because the configured browser-control service reported no available browser instance. No fallback was used and no browser, touch-emulation, fullscreen-activation, audio-output, console, or screenshot claim is made. Physical-device testing was not performed.

## Known publication blockers

- Human approval of the MIT scope and included-material ownership is pending.
- The staging repository exists but remains private by design; no public release or unauthenticated clone claim is made.
- Branch protection, pull-request enforcement, force-push/deletion blocking, secret scanning, and push protection are not active on the current private-plan repository. They require a supported plan or verification immediately after approved publication.
- Private vulnerability reporting cannot be enabled until the repository is public; `SECURITY.md` provides the interim private-contact policy.
- Interactive browser acceptance and an actual in-browser screenshot remain pending; a cleared 1200×630 share preview is prepared.
