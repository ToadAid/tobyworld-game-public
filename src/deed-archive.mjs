export const MAX_DEED_ID = 4000;
export const IPFS_GATEWAYS = Object.freeze([
  "https://dweb.link",
  "https://w3s.link",
  "https://ipfs.io",
]);

export function normalizeDeedId(value) {
  const text = String(value ?? "").trim().replace(/^#/, "");
  if (!/^\d{1,4}$/.test(text)) return null;
  const number = Number(text);
  if (!Number.isInteger(number) || number < 1 || number > MAX_DEED_ID) return null;
  return String(number).padStart(4, "0");
}

export function findCanonicalDeed(lands, value) {
  const id = normalizeDeedId(value);
  if (!id || !Array.isArray(lands)) return null;
  return lands.find((land) => land?.id === id) ?? null;
}

export function ipfsGatewayUrl(uri, gateway = "https://ipfs.io") {
  const match = String(uri ?? "").trim().match(/^ipfs:\/\/([a-zA-Z0-9]+)(\/[^?#]*)?$/);
  if (!match) return null;
  return `${gateway.replace(/\/$/, "")}/ipfs/${match[1]}${match[2] ?? ""}`;
}

export function ipfsGatewayUrls(uri, gateways = IPFS_GATEWAYS) {
  return gateways.map((gateway) => ipfsGatewayUrl(uri, gateway)).filter(Boolean);
}
