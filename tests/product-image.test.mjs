import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("la ruta de imágenes exige superadmin y limita el procesamiento", async () => {
  const route = await source("src/app/api/admin/product-image/route.ts");
  const python = await source("api/remove-background.py");

  assert.match(route, /runtime = "nodejs"/);
  assert.match(route, /verifyIdToken/);
  assert.match(route, /decoded\.role !== "superadmin"/);
  assert.match(route, /consumeRateLimit/);
  assert.match(route, /MAX_INPUT_BYTES = 8 \* 1024 \* 1024/);
  assert.match(route, /MAX_OUTPUT_BYTES = 360 \* 1024/);
  assert.match(route, /image\/jpeg/);
  assert.match(route, /image\/png/);
  assert.match(route, /image\/webp/);
  assert.match(route, /limitInputPixels/);
  assert.match(route, /flatten\(\{ background: "#ffffff" \}\)/);
  assert.match(route, /REMBG_INTERNAL_SECRET/);
  assert.match(route, /\/api\/remove-background/);
  assert.match(route, /duplex: "half"/);
  assert.match(route, /Cache-Control.*no-store/);
  assert.match(python, /hmac\.compare_digest/);
  assert.match(python, /new_session\(MODEL_NAME\)/);
  assert.match(python, /MODEL_NAME = os\.environ\.get\("REMBG_MODEL", "u2netp"\)/);
  assert.match(python, /MAX_INPUT_BYTES = 8 \* 1024 \* 1024/);
  assert.match(python, /Content-Type.*image\/png/);
});

test("el formulario envía archivos al procesador y conserva la alternativa por URL", async () => {
  const page = await source("src/app/admin/productos/page.tsx");

  assert.match(page, /type="file"/);
  assert.match(page, /accept="image\/jpeg,image\/png,image\/webp"/);
  assert.match(page, /Tomar foto/);
  assert.match(page, /capture="environment"/);
  assert.match(page, /\/api\/admin\/product-image/);
  assert.match(page, /getIdToken/);
  assert.match(page, /body\.append\("file", file\)/);
  assert.match(page, /O usar URL de imagen/);
  assert.match(page, /unoptimized=\{formImages\[0\]\.startsWith\("data:"\)\}/);
});

test("la identidad visual hace visible el naranja en ambos temas", async () => {
  const css = await source("src/app/globals.css");
  const hero = await source("src/components/storefront/HeroBanner.tsx");
  const categoryGrid = await source("src/components/storefront/CategoryGrid.tsx");
  const featuredProducts = await source("src/components/storefront/FeaturedProducts.tsx");
  const productCard = await source("src/components/storefront/ProductCard.tsx");

  assert.match(css, /--surface-warm: #fff0e3/);
  assert.match(css, /--surface-warm: #3a2114/);
  assert.equal((css.match(/--color-orange-500: #ff6b00/g) ?? []).length, 2);
  assert.match(hero, /bg-orange-500/);
  assert.match(categoryGrid, /bg-white.*dark:bg-slate-950/);
  assert.match(featuredProducts, /border-t-4 border-orange-500/);
  assert.match(featuredProducts, /border-orange-200 dark:border-orange-500\/40/);
  assert.match(productCard, /border-t-2 border-t-orange-500/);
  assert.match(productCard, /bg-orange-500/);
});
