// src/app/api/ai-recommend/route.js
//
// AI Jewellery Stylist — recommends real Taleo pieces from quiz answers.
// Optional: add GEMINI_API_KEY to .env.local for a richer AI-written summary.
// Get a free key at: https://aistudio.google.com/app/apikey
// Works fully without a key too — falls back to a rule-based stylist.

import { NextResponse } from "next/server";
import { API, normaliseProduct } from "../../lib/api";

const CATEGORY_SLUGS = {
  rings: "rings",
  necklaces: "necklaces",
  earrings: "earrings",
  bracelets: "bracelets",
};

const PRICE_RANGES = {
  "Under ₹5,000": { min: 0, max: 5000 },
  "₹5,000 – ₹15,000": { min: 5000, max: 15000 },
  "₹15,000 – ₹50,000": { min: 15000, max: 50000 },
  "₹50,000 – ₹1,00,000": { min: 50000, max: 100000 },
  "Above ₹1,00,000": { min: 100000, max: null },
};

// ─── Resolve category slug → id via Taleo's own categories endpoint ──────────
async function resolveCategoryId(slug) {
  if (!slug || !CATEGORY_SLUGS[slug]) return null;
  try {
    const res = await fetch(`${API}/categories`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const cats = json.data ?? [];
    const found = cats.find(
      (c) => c.slug === slug || c.name?.toLowerCase() === slug.toLowerCase()
    );
    return found?._id ?? null;
  } catch {
    return null;
  }
}

// ─── Fetch matching products, widening the search if too few results ────────
async function fetchMatches({ categoryId, tags, minPrice, maxPrice }) {
  async function run(params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const res = await fetch(`${API}/products?${qs}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data?.products ?? json.data ?? []).map(normaliseProduct);
  }

  const base = { limit: 8, sort: "newest" };
  if (categoryId) base.category = categoryId;
  if (minPrice) base.minPrice = minPrice;
  if (maxPrice) base.maxPrice = maxPrice;
  if (tags.length) base.tag = tags.join(",");

  let items = await run(base);
  if (items.length < 4 && tags.length) items = await run({ ...base, tag: undefined });
  if (items.length < 4 && (minPrice || maxPrice)) {
    items = await run({ limit: 8, sort: "newest", category: categoryId || undefined });
  }
  if (items.length < 4 && categoryId) items = await run({ limit: 8, sort: "newest" });
  return items.slice(0, 8);
}

// ─── Structured highlights — always correct, no grammar risk ─────────────────
function buildHighlights(answers, categoryLabel) {
  const rows = [
    { icon: "🎁", title: "Shopping For", subtitle: answers.recipient },
    { icon: "✨", title: "Occasion", subtitle: answers.occasion },
    { icon: "💍", title: "Piece", subtitle: categoryLabel },
    { icon: "🥇", title: "Metal", subtitle: answers.metal },
    { icon: "💎", title: "Gemstone", subtitle: answers.gemstone },
    { icon: "🎨", title: "Style", subtitle: answers.style },
    { icon: "💰", title: "Budget", subtitle: answers.budget },
  ];
  return rows.filter(
    (r) => r.subtitle && !["No Preference", "⏭ Skipped"].includes(r.subtitle)
  );
}

function ruleHeadline(categoryLabel) {
  return `Here's your personal edit, curated around ${categoryLabel.toLowerCase()} made for you.`;
}

// ─── Gemini call (optional) ──────────────────────────────────────────────────
async function callGemini(answers, categoryLabel) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are a warm jewellery stylist for Taleo, a fine-jewellery brand.

CUSTOMER ANSWERS:
- Shopping for: ${answers.recipient || "Not specified"}
- Occasion: ${answers.occasion || "Not specified"}
- Piece type: ${categoryLabel}
- Metal preference: ${answers.metal || "No preference"}
- Gemstone preference: ${answers.gemstone || "No preference"}
- Style: ${answers.style || "Not specified"}
- Budget: ${answers.budget || "Not specified"}

Write ONE short, warm headline sentence (max 16 words) introducing their curated jewellery edit, in a confident boutique-stylist voice. Plain text only, no markdown, no quotes, do not mention AI.`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 220 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Empty Gemini response");
  return text;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const answers = await request.json();

    const categorySlug = CATEGORY_SLUGS[(answers.category || "").toLowerCase()] || null;
    const categoryLabel = answers.category && answers.category !== "Surprise Me"
      ? answers.category
      : "a signature piece";

    const tags = [];
    if (answers.metal && answers.metal !== "No Preference") tags.push(answers.metal);
    if (answers.gemstone && !["No Preference", "No Stone"].includes(answers.gemstone)) tags.push(answers.gemstone);
    if (answers.gemstone === "No Stone") tags.push("No Stone");

    const range = PRICE_RANGES[answers.budget] || {};

    const categoryId = await resolveCategoryId(categorySlug);
    const products = await fetchMatches({ categoryId, tags, minPrice: range.min, maxPrice: range.max });

    let aiSummary;
    let source;
    try {
      aiSummary = await callGemini(answers, categoryLabel);
      source = "gemini";
    } catch {
      aiSummary = ruleHeadline(categoryLabel);
      source = "rules";
    }

    const highlights = buildHighlights(answers, categoryLabel);

    return NextResponse.json({
      aiSummary,
      highlights,
      source,
      suggestion: {
        categoryLabel,
        categorySlug,
        metal: answers.metal || null,
        gemstone: answers.gemstone || null,
        budgetLabel: answers.budget || null,
      },
      viewAllHref: categorySlug ? `/${categorySlug}` : "/shop",
      products,
    });
  } catch (err) {
    console.error("ai-recommend route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
