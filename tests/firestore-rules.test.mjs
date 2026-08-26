import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const rules = await readFile(new URL("../firestore.rules", import.meta.url), "utf8");

test("Firestore aplica denegación predeterminada", () => {
  assert.match(rules, /match \/\{document=\*\*\}/);
  assert.match(rules, /allow read, write: if false;/);
  assert.doesNotMatch(rules, /allow read, write: if true;/);
});

test("solo superadmin administra categorías", () => {
  assert.match(
    rules,
    /match \/categories\/\{categoryId\}[\s\S]*?allow write: if isSuperAdmin\(\);/,
  );
});

test("vendedor solo puede cambiar stock y fecha de actualización", () => {
  assert.match(
    rules,
    /role\(\) == 'vendedor'[\s\S]*?hasOnly\(\['stock', 'updatedAt'\]\)/,
  );
});
