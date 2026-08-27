import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("la ubicación pública usa el enlace oficial y un mapa embebido con fallback", async () => {
  const utilities = await source("src/lib/utils.ts");
  const location = await source("src/components/storefront/StoreLocationReviews.tsx");

  assert.match(utilities, /OFFICIAL_STORE_MAP_URL/);
  assert.match(utilities, /OFFICIAL_STORE_MAP_EMBED_URL/);
  assert.match(location, /iframe/);
  assert.match(location, /h-72 overflow-hidden/);
  assert.match(location, /block h-full w-full/);
  assert.match(location, /Abrir en Google Maps/);
  assert.match(location, /Ver indicaciones/);
});

test("las reseñas destacadas están atribuidas y limitadas a las referencias compartidas", async () => {
  const location = await source("src/components/storefront/StoreLocationReviews.tsx");

  assert.match(location, /Google Maps/);
  assert.match(location, /Excelente ferretería/iu);
  assert.match(location, /ynht\.0101/);
  assert.match(location, /source: "Instagram"/);
  assert.match(location, /59 sem/);
  assert.doesNotMatch(location, /Reseñas mostradas como referencia/iu);
  assert.equal((location.match(/author:/g) ?? []).length, 3);
});
