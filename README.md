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
and explicit human publication approval. See [PRIVATE_RELEASE_GATE.md](PRIVATE_RELEASE_GATE.md).
