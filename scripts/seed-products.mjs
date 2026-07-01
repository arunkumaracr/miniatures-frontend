/**
 * seed-products.mjs
 * Bulk-uploads product images and creates products via the admin API.
 *
 * Usage:
 *   node scripts/seed-products.mjs
 *
 * Requirements: Node 18+ (uses built-in fetch + FormData)
 */

import { readFileSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DATA = JSON.parse(readFileSync(join(__dirname, "products-seed.json"), "utf-8"));

const { apiBase, adminKey, assetsFolder, categories, products } = DATA;
const HEADERS = { "Content-Type": "application/json", "x-admin-key": adminKey };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  const map = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  return map[ext] ?? "application/octet-stream";
}

async function uploadImage(absolutePath, attempt = 1) {
  const MAX_RETRIES = 3;
  const filename = basename(absolutePath);
  const mimeType = getMimeType(absolutePath);
  const fileBytes = readFileSync(absolutePath);
  const blob = new Blob([fileBytes], { type: mimeType });

  const form = new FormData();
  form.append("image", blob, filename);

  try {
    const res = await fetch(`${apiBase}/api/upload`, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      body: form,
      signal: AbortSignal.timeout(30_000), // 30s timeout per attempt
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Upload failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    if (!data.imageUrl) throw new Error(`No imageUrl in upload response: ${JSON.stringify(data)}`);
    return data.imageUrl;
  } catch (e) {
    const isRetryable = e.name === "TimeoutError" || e.code === "ETIMEDOUT" || e.message.includes("ETIMEDOUT") || e.message.includes("timeout");
    if (isRetryable && attempt < MAX_RETRIES) {
      const wait = attempt * 2000;
      process.stdout.write(`\n  ⏳  Timeout — retrying in ${wait / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES}) … `);
      await new Promise((r) => setTimeout(r, wait));
      return uploadImage(absolutePath, attempt + 1);
    }
    throw e;
  }
}

async function createCategory(cat) {
  const res = await fetch(`${apiBase}/api/categories`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(cat),
  });
  const data = await res.json();
  if (res.status === 201) return { created: true };
  // Prisma unique constraint = already exists, treat as OK
  if (data.error?.includes("Unique") || data.error?.includes("already") || res.status === 409) {
    return { created: false };
  }
  if (!res.ok) throw new Error(`Category create failed (${res.status}): ${JSON.stringify(data)}`);
  return { created: true };
}

async function createProduct(payload) {
  const res = await fetch(`${apiBase}/api/products`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Product create failed (${res.status}): ${err}`);
  }
  return res.json();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("   Miniature Toys — Product Seed Script");
  console.log("═══════════════════════════════════════════\n");

  // 1. Verify backend is reachable
  log("🔌", `Connecting to ${apiBase} …`);
  try {
    const ping = await fetch(`${apiBase}/api/categories`);
    if (!ping.ok) throw new Error(`Status ${ping.status}`);
    log("✅", "Backend reachable.\n");
  } catch (e) {
    console.error(`\n❌  Cannot reach backend at ${apiBase}.\n    Make sure the server is running.\n    Error: ${e.message}\n`);
    process.exit(1);
  }

  // 2. Create categories
  log("📁", `Creating ${categories.length} categories …`);
  for (const cat of categories) {
    try {
      const { created } = await createCategory(cat);
      log(created ? "  ✅" : "  ⏭ ", `${cat.label} ${created ? "created" : "(already exists)"}`);
    } catch (e) {
      log("  ⚠️ ", `${cat.label} — ${e.message}`);
    }
  }
  console.log();

  // 3. Upload images + create products
  const skipArg = process.argv.find((a) => a.startsWith("--skip="));
  const startFrom = skipArg ? Math.max(0, parseInt(skipArg.split("=")[1], 10) - 1) : 0;
  if (startFrom > 0) log("⏩", `Skipping first ${startFrom} products (resuming from #${startFrom + 1})\n`);

  log("🛍 ", `Seeding ${products.length - startFrom} products …\n`);

  let created = 0;
  let skipped = 0;
  const errors = [];

  for (let i = startFrom; i < products.length; i++) {
    const p = products[i];
    const prefix = `[${String(i + 1).padStart(3, "0")}/${products.length}]`;
    const absoluteImage = join(assetsFolder, p.imagePath);

    if (!existsSync(absoluteImage)) {
      log("  ⚠️ ", `${prefix} MISSING image — skipping "${p.title}"\n         Path: ${absoluteImage}`);
      skipped++;
      continue;
    }

    try {
      // Upload image
      process.stdout.write(`  📤  ${prefix} Uploading image for "${p.title}" … `);
      const imageUrl = await uploadImage(absoluteImage);
      process.stdout.write("done\n");

      // Create product
      await createProduct({
        title: p.title,
        categoryId: p.categoryId,
        ageRange: p.ageRange ?? "",
        badge: p.badge ?? "",
        originalPrice: p.originalPrice,
        discountPrice: p.discountPrice,
        rating: p.rating ?? 4.5,
        reviewCount: p.reviewCount ?? 0,
        imageUrl,
        isAvailable: true,
        isTopSelling: p.isTopSelling ?? false,
      });

      log("  ✅", `${prefix} "${p.title}" — saved\n`);
      created++;
    } catch (e) {
      process.stdout.write("\n");
      log("  ❌", `${prefix} "${p.title}" — ${e.message}\n`);
      errors.push({ title: p.title, error: e.message });
    }
  }

  // 4. Summary
  console.log("═══════════════════════════════════════════");
  console.log(`✅  Created : ${created}`);
  console.log(`⏭   Skipped : ${skipped}`);
  console.log(`❌  Errors  : ${errors.length}`);
  if (errors.length > 0) {
    console.log("\nFailed products:");
    errors.forEach((e) => console.log(`   • ${e.title}\n     ${e.error}`));
  }
  console.log("═══════════════════════════════════════════\n");
}

main();
