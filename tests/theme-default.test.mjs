import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("el modo día es el predeterminado sin perder la preferencia guardada", async () => {
  const themeToggle = await readFile(
    new URL("../src/components/common/ThemeToggle.tsx", import.meta.url),
    "utf8",
  );

  assert.match(themeToggle, /return stored === "dark";/);
  assert.doesNotMatch(themeToggle, /prefers-color-scheme|matchMedia/);
});
