import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { KEEPER_WHISPERS, getKeeperWhisper } from "../src/dialogue.mjs";
import {
  HAPTIC_PATTERNS,
  VISUAL_EFFECTS_KEY,
  loadHapticsPreference,
  loadVisualEffectsPreference,
  saveHapticsPreference,
  saveVisualEffectsPreference,
  vibrateForEvent,
} from "../src/feedback.mjs";
import { STAGE_ORDER } from "../src/stages.mjs";

test("Keeper whispers are explicitly marked as adapted dialogue", () => {
  for (const name of ["Hush", "Satoby", "OG"]) {
    assert.equal(KEEPER_WHISPERS[name].adapted, true);
    assert.equal(KEEPER_WHISPERS[name].lines.length, 5);
    assert.equal(getKeeperWhisper(name), KEEPER_WHISPERS[name].lines[0]);
    assert.equal(getKeeperWhisper(name, "0715"), getKeeperWhisper(name, "0715"));
    assert.ok(new Set(Array.from({ length: 24 }, (_, index) => getKeeperWhisper(name, String(index + 1)))).size > 1);
  }
  assert.equal(getKeeperWhisper("Unknown"), "Listen. The land remembers patience.");
});

test("haptics remain optional, persisted, and sparse", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(loadHapticsPreference(storage), true);
  assert.equal(saveHapticsPreference(false, storage), true);
  assert.equal(loadHapticsPreference(storage), false);
  const calls = [];
  assert.equal(vibrateForEvent("relic", true, (pattern) => { calls.push(pattern); return true; }), true);
  assert.deepEqual(calls, [HAPTIC_PATTERNS.relic]);
  assert.deepEqual(HAPTIC_PATTERNS.taboshi_harvest, [18, 34, 18]);
  assert.deepEqual(HAPTIC_PATTERNS.tended, [14]);
  assert.equal(vibrateForEvent("light", true, () => true), false);
});

test("visual effects preference is validated and persisted", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(loadVisualEffectsPreference(storage), "full");
  assert.equal(loadVisualEffectsPreference(storage, "reduced"), "reduced");
  assert.equal(saveVisualEffectsPreference("reduced", storage), true);
  assert.equal(values.get(VISUAL_EFFECTS_KEY), "reduced");
  assert.equal(loadVisualEffectsPreference(storage), "reduced");
  assert.equal(saveVisualEffectsPreference("invalid", storage), false);
});

test("door portal wraps and the app shell progressively caches deed artwork", async () => {
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  const serviceWorker = await readFile(new URL("../sw.js", import.meta.url), "utf8");
  assert.match(styles, /grid-template-columns: repeat\(auto-fit, minmax\(92px, 1fr\)\)/);
  assert.doesNotMatch(serviceWorker, /assets\/deed-0715\.png/);
  assert.match(serviceWorker, /caches\.open\(CACHE_NAME\).*cache\.put/s);
});

test("campaign artwork uses smaller responsive WebP files while preserving PNG masters", async () => {
  for (const stage of STAGE_ORDER) {
    assert.equal(stage.art.canonical, `./assets/deed-thumbnails/${stage.id}.webp`);
    assert.equal(stage.art.canonicalSource, `./assets/deed-${stage.id}.png`);
    assert.equal(stage.art.imagined, `./assets/stage-art/imagined-${stage.id}.webp`);
    assert.equal(stage.art.imaginedLow, `./assets/stage-art/imagined-${stage.id}-768.webp`);
    assert.equal(stage.art.imaginedSource, `./assets/imagined-${stage.id}.png`);
    const source = await stat(new URL(`../assets/imagined-${stage.id}.png`, import.meta.url));
    const full = await stat(new URL(`../assets/stage-art/imagined-${stage.id}.webp`, import.meta.url));
    const mobile = await stat(new URL(`../assets/stage-art/imagined-${stage.id}-768.webp`, import.meta.url));
    assert.ok(full.size < source.size, `full WebP for ${stage.id} should be smaller than its PNG master`);
    assert.ok(mobile.size < full.size, `mobile WebP for ${stage.id} should be smaller than its full WebP`);
  }
});

test("the readiness controls are exposed accessibly", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(html, /id="haptics-button"[\s\S]*aria-pressed="true"/);
  assert.match(app, /function showControlIntroduction\(\)/);
  assert.match(app, /Toadaid adaptation/);
});

test("the Deed Archive lookup has labeled validation, live feedback, and a keyboard escape", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(html, /id="deed-wanderer-panel"[^>]*role="dialog"[^>]*aria-modal="true"/);
  assert.match(html, /label for="deed-lookup-input"/);
  assert.match(html, /id="deed-lookup-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(html, /Canonical signs and metadata visual only/);
  assert.match(app, /fetch\("\.\/data\/lore-lands\.json"\)/);
  assert.match(html, /id="deed-lookup-image"[^>]*width="240"[^>]*height="240"/);
  assert.match(app, /\.\/assets\/deed-thumbnails\/\$\{deed\.id\}\.webp/);
  assert.match(app, /getStage\(deed\.id\)\?\.art\?\.canonical/);
  assert.match(app, /ipfsGatewayUrls\(deed\.image\)/);
  assert.match(app, /Visual gateways unavailable; canonical signs remain available/);
  assert.match(app, /if \(!deedWandererPanel\.hidden\) \{[\s\S]*closeDeedWanderer\(\)/);
});

test("the About screen discloses privacy, provenance, canon boundaries, and accessible dismissal", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(html, /id="about-button"[^>]*aria-expanded="false"[^>]*aria-controls="about-panel"/);
  assert.match(html, /id="about-panel"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="about-heading"/);
  assert.match(html, /browser's local storage/);
  assert.match(html, /no account, wallet connection, analytics, advertising tracker, or automatic social posting/i);
  assert.match(html, /IPFS gateway fallback/);
  assert.match(html, /Toadaid adaptations—not claims about canonical lore or deed utility/);
  assert.match(html, /cards will be created locally and sharing will require an explicit player action/);
  assert.match(app, /function closeAboutPanel\(\)/);
  assert.match(app, /if \(!aboutPanel\.hidden\) \{[\s\S]*closeAboutPanel\(\)/);
  assert.match(app, /function trapModalFocus\(event\)/);
  assert.equal((html.match(/data-close-about/g) ?? []).length, 2);
  assert.match(html, /id="close-about-button"[^>]*aria-label="Close About and Privacy"/);
  assert.match(app, /closeAboutButtons\.forEach/);
});

test("Discover the Pond offers safe, accessible community paths without changing game state", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const serviceWorker = await readFile(new URL("../sw.js", import.meta.url), "utf8");
  assert.match(html, /id="community-button"[^>]*aria-expanded="false"[^>]*aria-controls="community-panel"/);
  assert.match(html, /id="community-panel"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="community-heading"/);
  for (const destination of ["https://t.me/toadgang", "https://tobyworld.app", "https://x.com/toadgod1017"]) {
    const escaped = destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.ok((html.match(new RegExp(`href="${escaped}"`, "g")) ?? []).length >= 2, `${destination} should appear in Discover and About`);
  }
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer external"/g) ?? []).length, 6);
  assert.match(html, /Built by ToadAid, for the Toadgang community/);
  assert.match(html, /not a claim of official endorsement by Tobyworld or Toadgod/i);
  assert.match(html, /No wallet, login, or token action is required/);
  assert.match(app, /function openCommunityPanel\(\)/);
  assert.match(app, /function closeCommunityPanel\(\)/);
  assert.match(app, /\[communityPanel, aboutPanel, deedWandererPanel, howPanel, pausePanel\]/);
  assert.match(serviceWorker, /tobyworld-paths-v54/);
});

test("public sharing metadata uses the production URL and existing title artwork", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /rel="canonical" href="https:\/\/tobyworld-game\.vercel\.app\/"/);
  assert.match(html, /property="og:url" content="https:\/\/tobyworld-game\.vercel\.app\/"/);
  assert.match(html, /property="og:image" content="https:\/\/tobyworld-game\.vercel\.app\/assets\/tobyworld-trio\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:image:alt"/);
});

test("sandbox phone mode keeps its no-save boundary and accepted landscape touch targets visible", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(html, /id="sandbox-mode-badge"[^>]*hidden>GENERATED SANDBOX · NO CAMPAIGN SAVE/);
  assert.match(app, /sandboxModeBadge\.hidden = !activeStage\.isSandbox/);
  assert.match(styles, /@media \(orientation: landscape\)[\s\S]*?\.touch-button \{[\s\S]*?width: 46px;[\s\S]*?height: 46px;/);
  assert.match(styles, /@media \(orientation: landscape\)[\s\S]*?\.ability-button \{[\s\S]*?width: 52px;[\s\S]*?min-height: 52px;/);
});

test("mobile pause and fullscreen controls do not depend on a keyboard", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const manifest = JSON.parse(await readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8"));
  assert.match(html, /id="fullscreen-button"[^>]*aria-label="Enter fullscreen"[^>]*aria-pressed="false"/);
  assert.match(html, /TAP RESUME OR ▶ TO CONTINUE/);
  assert.match(app, /touchPrimary\.matches \? "Tap the land or ▶ to continue"/);
  assert.match(app, /game\.phase === "playing" && game\.paused && pausePanel\.hidden\) \{ swipeStart = null; togglePause\(\); return; \}/);
  assert.match(app, /!pausePanel\.hidden \|\| \(game\.phase === "playing" && game\.paused\)\) resumeFromMenu\(\)/);
  assert.match(app, /request\.call\(root, \{ navigationUI: "hide" \}\)/);
  assert.match(app, /touchPrimary\.matches && !fullscreenElement\(\) && !isStandaloneDisplay\(\)/);
  assert.match(app, /Add to Home screen/);
  assert.deepEqual(manifest.display_override, ["fullscreen", "standalone"]);
});

test("pause settings expose persistent, touch-sized music and effects levels", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(html, /class="setting-options" role="group" aria-labelledby="music-level-label"/);
  assert.match(html, /class="setting-options" role="group" aria-labelledby="effects-level-label"/);
  assert.equal((html.match(/data-audio-level=/g) ?? []).length, 6);
  assert.match(styles, /\.setting-options button \{[\s\S]*?min-height: 44px;/);
  assert.match(app, /loadAudioPreferences\(\)/);
  assert.match(app, /saveAudioPreferences\(audioPreferences\)/);
  assert.match(app, /reactiveAudio\.setMix/);
});

test("pause settings mirror haptics and offer a persistent reduced-effects mode", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.equal((html.match(/data-haptics-setting=/g) ?? []).length, 2);
  assert.equal((html.match(/data-visual-effects=/g) ?? []).length, 2);
  assert.match(app, /saveHapticsPreference\(hapticsEnabled\)/);
  assert.match(app, /saveVisualEffectsPreference\(level\)/);
  assert.match(app, /reducedMotionMedia\.addEventListener/);
  assert.match(styles, /:root\.reduced-effects \*/);
});

test("phone landscape uses the full dynamic viewport instead of a centered 16:9 island", async () => {
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(styles, /@media \(orientation: landscape\) and \(max-height: 600px\) and \(max-width: 1400px\)/);
  assert.match(styles, /@media \(orientation: landscape\)[\s\S]*?\.game-frame \{[\s\S]*?width: 100vw;[\s\S]*?height: 100dvh;[\s\S]*?aspect-ratio: auto;/);
});

test("mobile title screens use the available viewport without showing inactive game controls", async () => {
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(styles, /\.app-shell:has\(#title-screen:not\(\[hidden\]\)\) \.mobile-controls \{ display: none; \}/);
  assert.match(styles, /\.game-frame:has\(#title-screen:not\(\[hidden\]\)\) \{ height: 100%; aspect-ratio: auto; \}/);
});

test("short About dialogs keep a discoverable close control while their content scrolls", async () => {
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(styles, /\.modal-panel \{[\s\S]*?overscroll-behavior: contain;[\s\S]*?scrollbar-gutter: stable;/);
  assert.match(styles, /\.about-panel__header \{[\s\S]*?position: sticky;[\s\S]*?top: 0;/);
  assert.match(styles, /@media \(orientation: landscape\)[\s\S]*?\.about-panel \{[\s\S]*?max-height: calc\(100dvh - 16px\);/);
});

test("desktop title art can use the available height without distorting its 16:9 frame", async () => {
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(styles, /@media \(min-width: 861px\) and \(pointer: fine\)[\s\S]*?\.game-frame:has\(#title-screen:not\(\[hidden\]\)\) \{[\s\S]*?height: min\(calc\(100dvh - 138px\), 56\.25vw\);/);
});

test("gameplay announcements stay translucent and away from the playfield center", async () => {
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(styles, /\.announcement \{[\s\S]*?top: 12px;[\s\S]*?background: rgba\(5, 29, 42, 0\.48\);/);
  assert.match(styles, /\.announcement small \{ display: block;/);
});
