import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = path.join(projectRoot, "LogoMultiogar.png");

async function run() {
  fs.copyFileSync(logo, path.join(projectRoot, "public", "LogoMultiogar.png"));
  fs.copyFileSync(logo, path.join(projectRoot, "public", "logo.png"));
  await sharp(logo).resize(32, 32, { fit: "contain" }).toFile(path.join(projectRoot, "public", "favicon.ico"));
  await sharp(logo).resize(32, 32, { fit: "contain" }).toFile(path.join(projectRoot, "src", "app", "favicon.ico"));
  await sharp(logo).resize(180, 180, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  }).png().toFile(path.join(projectRoot, "public", "apple-touch-icon.png"));
  await sharp(logo).resize(192, 192, { fit: "contain" }).png().toFile(path.join(projectRoot, "public", "icon-192.png"));
  await sharp(logo).resize(512, 512, { fit: "contain" }).png().toFile(path.join(projectRoot, "public", "icon-512.png"));
  await sharp(logo).resize(1200, 630, {
    fit: "contain",
    background: { r: 15, g: 23, b: 42, alpha: 1 },
  }).png().toFile(path.join(projectRoot, "public", "og-image.png"));
}

run().catch((error) => {
  console.error("No fue posible generar los recursos de marca.", error);
  process.exitCode = 1;
});
