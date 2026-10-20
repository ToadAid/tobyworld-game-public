import { LEVEL_0094, LEVEL_0118, LEVEL_0182, LEVEL_0340, LEVEL_0378, LEVEL_0887, LEVEL_0969, LEVEL_1091, LEVEL_715, LEVEL_716, LEVEL_717, LEVEL_718 } from "./core.mjs";

function stageArt(id) {
  return Object.freeze({
    canonical: `./assets/deed-thumbnails/${id}.webp`,
    canonicalSource: `./assets/deed-${id}.png`,
    imagined: `./assets/stage-art/imagined-${id}.webp`,
    imaginedLow: `./assets/stage-art/imagined-${id}-768.webp`,
    imaginedSource: `./assets/imagined-${id}.png`,
    imaginedCredit: "Toadaid Forge",
  });
}

const STAGE_0715 = Object.freeze({
  id: "0715",
  title: "Paths of Patience",
  level: LEVEL_715,
  art: stageArt("0715"),
  theme: Object.freeze({
    backdropOpacity: 0.82,
    backdropBlur: 0.6,
    backdropSaturation: 1.06,
    landTop: "rgba(34, 108, 67, 0.22)",
    landBottom: "rgba(9, 52, 43, 0.38)",
    landBorder: "rgba(220, 255, 181, 0.76)",
    hudPanel: "rgba(4, 30, 44, 0.72)",
    hudCard: "rgba(10, 50, 64, 0.58)",
  }),
});

const STAGE_0716 = Object.freeze({
  id: "0716",
  title: "Frostveil Crossing",
  level: LEVEL_716,
  art: stageArt("0716"),
  theme: Object.freeze({
    terrain: "frostveil",
    backdropOpacity: 0.86,
    backdropBlur: 0.35,
    backdropSaturation: 1.08,
    landTop: "rgba(105, 139, 206, 0.18)",
    landBottom: "rgba(50, 42, 111, 0.35)",
    landBorder: "rgba(222, 239, 255, 0.88)",
    hudPanel: "rgba(31, 27, 78, 0.74)",
    hudCard: "rgba(76, 64, 134, 0.58)",
  }),
});

const STAGE_0717 = Object.freeze({
  id: "0717",
  title: "Stillwater Dawn",
  intro: "Cross the quiet water. Carry the Seed Vessel. Awaken the Taboshi Core.",
  level: LEVEL_717,
  art: stageArt("0717"),
  theme: Object.freeze({
    terrain: "stillwater",
    backdropOpacity: 0.88,
    backdropBlur: 0.3,
    backdropSaturation: 1.04,
    landTop: "rgba(255, 198, 112, 0.18)",
    landBottom: "rgba(32, 91, 92, 0.38)",
    landBorder: "rgba(255, 230, 159, 0.9)",
    hudPanel: "rgba(27, 54, 62, 0.76)",
    hudCard: "rgba(62, 105, 101, 0.58)",
  }),
});

const STAGE_0718 = Object.freeze({
  id: "0718",
  title: "Cloudwake Ascent",
  intro: "Cross the cloud bridge. Tend the Sunfield. Carry the Wayfinder to the Eclipse Core.",
  level: LEVEL_718,
  art: stageArt("0718"),
  theme: Object.freeze({
    terrain: "cloudwake",
    backdropOpacity: 0.9,
    backdropBlur: 0.2,
    backdropSaturation: 1.03,
    landTop: "rgba(255, 221, 143, 0.2)",
    landBottom: "rgba(126, 162, 205, 0.34)",
    landBorder: "rgba(255, 242, 195, 0.94)",
    hudPanel: "rgba(28, 55, 82, 0.76)",
    hudCard: "rgba(106, 91, 126, 0.58)",
  }),
});

const STAGE_0340 = Object.freeze({
  id: "0340",
  title: "Garden of the Shard",
  intro: "Follow the breathing paths. Read the Ancient Rune. Awaken the Shard beneath Sporegrove.",
  level: LEVEL_0340,
  art: stageArt("0340"),
  theme: Object.freeze({
    terrain: "sporegrove",
    backdropOpacity: 0.9,
    backdropBlur: 0.2,
    backdropSaturation: 1.05,
    landTop: "rgba(255, 198, 107, 0.2)",
    landBottom: "rgba(70, 94, 61, 0.4)",
    landBorder: "rgba(255, 225, 151, 0.92)",
    hudPanel: "rgba(42, 48, 58, 0.78)",
    hudCard: "rgba(81, 76, 53, 0.62)",
  }),
});

const STAGE_0378 = Object.freeze({
  id: "0378",
  title: "The Ember Oath",
  intro: "Cross on the cool tide. Read the Ancient Rune. Awaken the Sato Core beyond Emberreach.",
  level: LEVEL_0378,
  art: stageArt("0378"),
  theme: Object.freeze({
    terrain: "emberreach",
    backdropOpacity: 0.9,
    backdropBlur: 0.2,
    backdropSaturation: 1.08,
    landTop: "rgba(255, 177, 91, 0.2)",
    landBottom: "rgba(77, 42, 48, 0.43)",
    landBorder: "rgba(255, 211, 137, 0.94)",
    hudPanel: "rgba(51, 37, 52, 0.8)",
    hudCard: "rgba(102, 62, 54, 0.62)",
  }),
});

const STAGE_0118 = Object.freeze({
  id: "0118",
  title: "The Box Beneath the Moon",
  intro: "Find the Kiribako. Follow its three echoes through Mossmere. Awaken the Taboshi Core.",
  level: LEVEL_0118,
  art: stageArt("0118"),
  theme: Object.freeze({
    terrain: "mossmere",
    backdropOpacity: 0.91,
    backdropBlur: 0.2,
    backdropSaturation: 1.05,
    landTop: "rgba(164, 125, 211, 0.18)",
    landBottom: "rgba(29, 76, 67, 0.44)",
    landBorder: "rgba(225, 211, 255, 0.93)",
    hudPanel: "rgba(37, 36, 70, 0.8)",
    hudCard: "rgba(68, 79, 105, 0.62)",
  }),
});

const STAGE_0182 = Object.freeze({
  id: "0182",
  title: "The Meadow Gate",
  intro: "Find the Gate Key. Open the meadow shortcuts. Carry Patience home to its Core.",
  level: LEVEL_0182,
  art: stageArt("0182"),
  theme: Object.freeze({
    terrain: "meadow",
    backdropOpacity: 0.9,
    backdropBlur: 0.15,
    backdropSaturation: 1.06,
    landTop: "rgba(255, 218, 126, 0.18)",
    landBottom: "rgba(100, 121, 60, 0.4)",
    landBorder: "rgba(255, 239, 171, 0.95)",
    hudPanel: "rgba(55, 55, 53, 0.78)",
    hudCard: "rgba(99, 92, 61, 0.62)",
  }),
});

const STAGE_0887 = Object.freeze({
  id: "0887",
  title: "The Map in the Frost",
  intro: "Find the Lore Map. Let it chart the Frostveil. Awaken the Shard beyond the storm.",
  level: LEVEL_0887,
  art: stageArt("0887"),
  theme: Object.freeze({
    terrain: "mapfrost",
    backdropOpacity: 0.91,
    backdropBlur: 0.2,
    backdropSaturation: 1.05,
    landTop: "rgba(184, 216, 255, 0.18)", landBottom: "rgba(56, 65, 123, 0.42)", landBorder: "rgba(229, 246, 255, 0.95)",
    hudPanel: "rgba(35, 41, 79, 0.8)", hudCard: "rgba(69, 80, 137, 0.62)",
  }),
});

const STAGE_1091 = Object.freeze({
  id: "1091",
  title: "The Key Below Stillwater",
  intro: "Listen to Hush. Become completely still. Trust the submerged way to the Gate Key and Taboshi Core.",
  level: LEVEL_1091,
  art: stageArt("1091"),
  theme: Object.freeze({
    terrain: "veilwater",
    backdropOpacity: 0.9,
    backdropBlur: 0.15,
    backdropSaturation: 1.07,
    landTop: "rgba(178, 239, 193, 0.18)", landBottom: "rgba(29, 101, 91, 0.43)", landBorder: "rgba(220, 255, 204, 0.95)",
    hudPanel: "rgba(22, 61, 64, 0.8)", hudCard: "rgba(46, 100, 88, 0.62)",
  }),
});

const STAGE_0969 = Object.freeze({
  id: "0969",
  title: "At the Pond's Threshold",
  intro: "Breathe beside the Pond rings, or listen to Satoby and be welcomed. Find the Gate Key without claiming the threshold.",
  level: LEVEL_0969,
  art: stageArt("0969"),
  theme: Object.freeze({
    terrain: "pond",
    backdropOpacity: 0.91,
    backdropBlur: 0.12,
    backdropSaturation: 1.06,
    landTop: "rgba(207, 236, 255, 0.2)", landBottom: "rgba(54, 128, 125, 0.43)", landBorder: "rgba(255, 239, 174, 0.96)",
    hudPanel: "rgba(30, 61, 83, 0.82)", hudCard: "rgba(62, 107, 113, 0.64)",
  }),
});

const STAGE_0094 = Object.freeze({
  id: "0094",
  title: "The Pond Remembers",
  intro: "Find the Wayfinder. Become still upon the three Door Echoes. Let every awakened path answer together.",
  level: LEVEL_0094,
  art: stageArt("0094"),
  theme: Object.freeze({
    terrain: "pondmemory",
    backdropOpacity: 0.92,
    backdropBlur: 0.1,
    backdropSaturation: 1.08,
    landTop: "rgba(226, 245, 194, 0.2)", landBottom: "rgba(43, 117, 103, 0.44)", landBorder: "rgba(255, 235, 151, 0.98)",
    hudPanel: "rgba(25, 62, 67, 0.84)", hudCard: "rgba(62, 112, 94, 0.66)",
  }),
});

export const STAGES = Object.freeze({
  [STAGE_0715.id]: STAGE_0715,
  [STAGE_0716.id]: STAGE_0716,
  [STAGE_0717.id]: STAGE_0717,
  [STAGE_0718.id]: STAGE_0718,
  [STAGE_0340.id]: STAGE_0340,
  [STAGE_0378.id]: STAGE_0378,
  [STAGE_0118.id]: STAGE_0118,
  [STAGE_0182.id]: STAGE_0182,
  [STAGE_0887.id]: STAGE_0887,
  [STAGE_1091.id]: STAGE_1091,
  [STAGE_0969.id]: STAGE_0969,
  [STAGE_0094.id]: STAGE_0094,
});

export const STAGE_ORDER = Object.freeze([STAGE_0715, STAGE_0716, STAGE_0717, STAGE_0718, STAGE_0340, STAGE_0378, STAGE_0118, STAGE_0182, STAGE_0887, STAGE_1091, STAGE_0969, STAGE_0094]);

export const ACTIVE_STAGE = STAGE_0715;

export function getStage(id) {
  return STAGES[String(id).padStart(4, "0")] ?? null;
}

export function getNextStage(id) {
  const index = STAGE_ORDER.findIndex((stage) => stage.id === String(id).padStart(4, "0"));
  return index >= 0 ? STAGE_ORDER[index + 1] ?? null : null;
}
