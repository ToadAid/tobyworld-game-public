# Tobyworld: Paths of Patience — Full Game

**Built by ToadAid, for the Toadgang community.**

This repository contains the **real full-game browser runtime**, including the
12-world campaign, Lore Land explorer, and production game assets. It is
**not** the earlier three-world sample.

## Play locally (authorized reviewers)

This repository is currently private. Clone it using an account with access:

```bash
git clone https://github.com/ToadAid/tobyworld-game-public.git
cd tobyworld-game-public
python3 -m http.server 7777 --bind 127.0.0.1
```

Open <http://127.0.0.1:7777/> in a browser on the same computer.
Compare the experience with <https://tobyworld-game.vercel.app/>.
Stop the local test server with `Ctrl+C`.

Port **7777** is a suggested local test port, not a production setting.
If it is occupied, select another unused port; do not stop unrelated services.

## Explore the real game

![Abstract Paths of Patience project preview](docs/game-preview.svg)

*Paths of Patience* is a free, wallet-free maze adventure through twelve Lore Land worlds. Guide Toby, practice **Patience** and **Yield**, and discover the wider pond. This is a ToadAid-created community adaptation; it does **not** claim official endorsement from Tobyworld or Toadgod.

- **12-world campaign** with local saves, objectives, scores and unlocks.
- **2,869 canonical Lore Land Deeds** indexed for lookup, plus deterministic sandbox worlds built from each deed's five signs.
- Keyboard, touch, standard-controller, audio and accessibility controls.
- No wallet, login, analytics, advertising or gameplay backend.

### Controls

Arrow keys / WASD move Toby; hold **Space** for Patience; **Q** uses Yield; **P** or **Escape** pauses. On phones, use the on-screen controls; a compatible gamepad is also supported.

### Developers

The browser runtime has no npm dependencies. Node.js and Python 3 are required only for local development checks and optional authorized asset builders.

```bash
npm run check
npm test
npm run audit:sandboxes
```

Test routes: `?test=1` for the twelve stages, `?test=1&deed=715` for a stage, `?lookup=94` for deed lookup, and `?sandbox=1&deed=94` for sandbox play.

Read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [SECURITY.md](SECURITY.md), [CAMPAIGN_STORY.md](CAMPAIGN_STORY.md), [COMMUNITY_ONBOARDING_P1.md](COMMUNITY_ONBOARDING_P1.md), and [PHYSICAL_DEVICE_QA.md](PHYSICAL_DEVICE_QA.md).

## License boundaries

The original source repository's [MIT LICENSE](LICENSE) is included for eligible ToadAid-owned game code and code-oriented documentation, **subject to confirmation of contributor authority and owner approval**. It does not grant permission to redistribute Tobyworld characters, lore, canonical images/metadata, Keeper art, imagined artwork, derivatives, trademarks, or any third-party materials. See [ASSET_LICENSE.md](ASSET_LICENSE.md).

## Release status — PRIVATE, NOT YET CLEARED FOR PUBLICATION

**DO NOT MAKE THIS REPOSITORY PUBLIC YET.** Canonical deed imagery and metadata,
character art, imagined Lore Land artwork, derived imagery, audio, and other
associated intellectual property have **not been cleared for public
redistribution by this private technical copy**. Original rights holders
retain their rights; no open-source license is granted to these assets here.
Public NFT availability, Base onchain metadata, and IPFS retrievability do
not by themselves establish permission to redistribute copyrighted assets.

The private production Git history was not imported; production Vercel remains
unchanged. Before making any branch or history public, complete artwork and
metadata rights review, secret/history audit, interactive browser/mobile checks,
and explicit human publication approval. See [PUBLIC_RELEASE_CHECKLIST.md](PUBLIC_RELEASE_CHECKLIST.md) and [PRIVATE_RELEASE_GATE.md](PRIVATE_RELEASE_GATE.md).
