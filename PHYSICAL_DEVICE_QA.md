# Tobyworld Physical-Device QA

Automated route audit command:

```bash
npm run audit:sandboxes
```

For same-computer tests use `python3 -m http.server 7777 --bind 127.0.0.1`. For physical-phone tests on a **trusted LAN only**, bind explicitly to Dell's LAN address using `python3 -m http.server 7777 --bind <DELL_LAN_IP>` and visit `http://<DELL_LAN_IP>:7777/` from the phone. Do not expose this private asset bundle to the public Internet. A phone cannot reach the Dell server through `localhost`.

## Representative sandbox matrix

These nine deeds deterministically cover every Background, Land, Core, Relic, and Keeper value in the canonical archive.

| Deed | Primary combination under test | iOS | Android |
|---|---|---|---|
| #1 | Verdant Veil · The Pond · Shard · Gate Key · Satoby | [ ] | [ ] |
| #3 | Violet Dusk · Emberreach · Rootbound · Seed Vessel · OG | [ ] | [ ] |
| #42 | Cloudwake · Stillwater · Taboshi · Kiribako · Hush | [ ] | [ ] |
| #220 | Gilded Dawn · Mossmere · Eclipse · Lore Map · Hush | [ ] | [ ] |
| #8 | Verdant Veil · Waystones · Patience · Ancient Rune · Satoby | [ ] | [ ] |
| #50 | Verdant Veil · Sunfield · Sato · Wayfinder Compass · OG | [ ] | [ ] |
| #4 | Verdant Veil · Frostveil · Eclipse · Gate Key · Satoby | [ ] | [ ] |
| #5 | Violet Dusk · Sporegrove · Shard · Gate Key · Hush | [ ] | [ ] |
| #10 | Gilded Dawn · Meadow · Eclipse · Seed Vessel · Hush | [ ] | [ ] |

Open a row with `?sandbox=1&deed=NUMBER`, for example `?sandbox=1&deed=1`.

## Checks for every row

- [ ] The canonical image loads and the generated-sandbox boundary remains visible.
- [ ] Landscape 844×390 remains playable without clipped controls or browser-gesture conflicts.
- [ ] Portrait controls remain inside the viewport with at least 8px separation.
- [ ] D-pad movement stops cleanly; Patience and Yield respond without accidental double activation.
- [ ] Keeper, Relic, Core rule, and Land traversal can each be completed.
- [ ] Pause, restart, quit, mute, and optional haptics remain reachable.
- [ ] Completing or quitting the sandbox does not unlock a campaign deed or change a best score.
- [ ] Reduced-motion mode remains readable and removes decorative motion.
- [ ] Fifteen minutes of play produces no unacceptable heat, battery drain, audio crackle, or input lag.

Record the device model, OS/browser version, orientation, failed deed, and exact reproduction steps beside any issue. Physical boxes must stay unchecked until performed on hardware.
