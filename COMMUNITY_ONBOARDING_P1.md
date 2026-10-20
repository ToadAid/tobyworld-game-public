# Community Onboarding P1

## Mission

`Discover the Pond` gives a new visitor an optional, wallet-free path from the title screen to the Toadgang community, the wider Tobyworld ecosystem, and Toadgod's public posts. It does not alter campaign progress, game controls, or the canonical/adaptation boundary.

## Public destinations

- [Join Toadgang](https://t.me/toadgang) — meet the community and discover the lore.
- [Explore Tobyworld](https://tobyworld.app) — discover the wider Tobyworld ecosystem.
- [Follow Toadgod](https://x.com/toadgod1017) — read Toadgod's posts and explore the source of the lore.

All three destinations open in a new tab with `noopener`, `noreferrer`, an external-link relationship, visible external-link treatment, and accessible names that announce the new tab. The same destinations and the community message are recorded in About & Privacy.

## Product boundaries

- This is a ToadAid-created community game adaptation, not a claim of official endorsement by Tobyworld or Toadgod.
- No wallet connection, login, token promotion, analytics, advertising, or Farcaster SDK was added.
- Existing progress remains under the unchanged `tobyworld-paths-progress` key and version 10 schema.
- Existing artwork, gameplay controls, fullscreen behavior, sound, haptics, and reduced-motion behavior remain in place.
- Social previews reuse the existing `assets/tobyworld-trio.png` title artwork; its use here does not establish public redistribution rights.
- Service-worker cache `tobyworld-paths-v53` replaces the previous shell after deployment.

## Verification record

Recorded on 2026-10-19:

- `npm run check` — passed.
- `npm test` — passed, 11 test files with no failures.
- `npm run audit:sandboxes` — passed, all 2,869 generated sandboxes remain reachable and completable.
- Destination validation — HTTP 200 for `https://t.me/toadgang`, `https://tobyworld.app`, and `https://x.com/toadgod1017` after redirects.
- Current production baseline — HTTP 200 for `https://tobyworld-game.vercel.app/` before this change is deployed.
- Static UI contracts cover dialog semantics, focus trapping and restoration, safe external-link attributes, credits duplication, disclaimer copy, production metadata, and the `v53` cache bump.
- Existing progress migration tests pass with the save key and version unchanged.

The connected browser surface was unavailable during implementation, so no screenshot, rendered viewport, keyboard walkthrough, fullscreen interaction, or production visual verification is claimed yet. Physical-device testing is also not claimed. These remain release gates before production promotion.
