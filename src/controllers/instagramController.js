import { success, error } from "../utils/apiResponse.js";

/**
 * GET /api/v1/instagram/posts
 *
 * Fetches recent media from the Instagram Graph API using a long-lived
 * access token stored in INSTAGRAM_ACCESS_TOKEN env variable.
 *
 * Instagram Graph API setup steps (add to your README):
 *  1. Create a Facebook App at developers.facebook.com
 *  2. Add "Instagram Basic Display" product
 *  3. Generate a short-lived token, then exchange for a long-lived token:
 *     GET https://graph.instagram.com/access_token
 *       ?grant_type=ig_exchange_token
 *       &client_secret=YOUR_APP_SECRET
 *       &access_token=SHORT_LIVED_TOKEN
 *  4. Long-lived tokens expire in 60 days — refresh them every ~50 days:
 *     GET https://graph.instagram.com/refresh_access_token
 *       ?grant_type=ig_refresh_token
 *       &access_token=LONG_LIVED_TOKEN
 *  5. Set INSTAGRAM_ACCESS_TOKEN=<token> in your .env
 */

const FALLBACK_POSTS = [
  {
    id: "1",
    media_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80&fit=crop",
    permalink: "https://instagram.com",
    caption: "Timeless solitaire — forged in 22k gold. ✨ #FineJewellery",
    timestamp: new Date().toISOString(),
    like_count: 2418,
    comments_count: 84,
  },
  {
    id: "2",
    media_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80&fit=crop",
    permalink: "https://instagram.com",
    caption: "Rose gold pendant. Worn like a whisper. 🌹 #CocoaEdit",
    timestamp: new Date().toISOString(),
    like_count: 1847,
    comments_count: 61,
  },
  {
    id: "3",
    media_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80&fit=crop",
    permalink: "https://instagram.com",
    caption: "Drop earrings that do all the talking. 💎 #WinterDrop",
    timestamp: new Date().toISOString(),
    like_count: 3102,
    comments_count: 109,
  },
  {
    id: "4",
    media_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80&fit=crop",
    permalink: "https://instagram.com",
    caption: "Stack it. Layer it. Own it. #TennisBracelet",
    timestamp: new Date().toISOString(),
    like_count: 2731,
    comments_count: 93,
  },
  {
    id: "5",
    media_url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80&fit=crop",
    permalink: "https://instagram.com",
    caption: "Sculpted in warmth. Worn like a secret. 🤎 #EternalBeauty",
    timestamp: new Date().toISOString(),
    like_count: 4209,
    comments_count: 147,
  },
  {
    id: "6",
    media_url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&q=80&fit=crop",
    permalink: "https://instagram.com",
    caption: "Every facet tells a story. #DiamondCraft",
    timestamp: new Date().toISOString(),
    like_count: 1623,
    comments_count: 55,
  },
  {
    id: "7",
    media_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80&fit=crop",
    permalink: "https://instagram.com",
    caption: "The unboxing is part of the gift. 🎁 #LuxuryGifting",
    timestamp: new Date().toISOString(),
    like_count: 2104,
    comments_count: 78,
  },
  {
    id: "8",
    media_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80&fit=crop",
    permalink: "https://instagram.com",
    caption: "Fine jewellery for the life you live. ✨ #CocoaEdit",
    timestamp: new Date().toISOString(),
    like_count: 3914,
    comments_count: 132,
  },
];

export const getInstagramPosts = async (req, res) => {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    // No token configured — return curated fallback posts
    return success(res, { posts: FALLBACK_POSTS, source: "fallback" }, "Instagram posts (fallback)");
  }

  try {
    const limit = parseInt(req.query.limit) || 12;
    const fields = "id,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count,media_type";

    const apiUrl =
      `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error("Instagram API error:", data.error);
      return success(res, { posts: FALLBACK_POSTS, source: "fallback" }, "Instagram posts (fallback)");
    }

    // Filter out VIDEO-only posts without a thumbnail, keep IMAGE + CAROUSEL_ALBUM
    const posts = (data.data || []).filter(
      (p) => p.media_type !== "VIDEO" || p.thumbnail_url
    ).map((p) => ({
      ...p,
      media_url: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url,
    }));

    return success(res, { posts, source: "instagram" }, "Instagram posts");
  } catch (err) {
    console.error("Instagram fetch failed:", err.message);
    return success(res, { posts: FALLBACK_POSTS, source: "fallback" }, "Instagram posts (fallback)");
  }
};
