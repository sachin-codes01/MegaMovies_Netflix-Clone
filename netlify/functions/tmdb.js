/*
  Ye ek Netlify serverless function hai jo TMDB ke saamne proxy ka kaam karti hai.

  Kyun chahiye:
  1. Kai ISPs (khaas kar India me) api.themoviedb.org ko block kar dete hain.
     Yahan request browser se nahi, Netlify ke server se jaati hai - to block lagta hi nahi.
  2. API key server par rehti hai, client bundle me nahi jaati.

  Browser call karta hai: /.netlify/functions/tmdb?endpoint=movie/popular&page=1
*/

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Chhota helper - JSON error bhejne ke liye
function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default async function handler(request) {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get("endpoint");

  if (!endpoint) {
    return jsonError("Missing 'endpoint' query parameter.", 400);
  }

  // Sirf TMDB jaise safe paths allow karo - koi apni marzi ka URL na ghusa de
  if (!/^[a-zA-Z0-9/_-]+$/.test(endpoint)) {
    return jsonError("Invalid endpoint.", 400);
  }

  const apiKey = process.env.TMDB_KEY;
  if (!apiKey) {
    return jsonError("TMDB_KEY is not configured on the server.", 500);
  }

  // Baaki saare params (page, query, etc) aage bhej do, endpoint ko hata kar
  const params = new URLSearchParams(url.searchParams);
  params.delete("endpoint");
  params.set("api_key", apiKey);

  const tmdbResponse = await fetch(`${TMDB_BASE_URL}/${endpoint}?${params}`);
  const body = await tmdbResponse.text();

  return new Response(body, {
    status: tmdbResponse.status,
    headers: {
      "content-type": "application/json",
      // Thoda cache - same request baar baar TMDB tak na jaye
      "cache-control": "public, max-age=300",
    },
  });
}
