// Netlify Function: server-side proxy for the TMDB API.
//
// Browser calls hit this function (same origin as the site), and this
// function calls TMDB from Netlify's servers. This keeps the TMDB API key
// out of the client bundle, and avoids client-side ISP blocks on
// api.themoviedb.org (the request to TMDB never leaves Netlify's network).

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function handler(event) {
  // When invoked via the /api/tmdb/* redirect, event.path is the ORIGINAL
  // request path (e.g. "/api/tmdb/movie/550"), not the rewritten
  // "/.netlify/functions/tmdb/..." form - so both prefixes must be handled.
  const endpoint = event.path
    .replace(/^\/api\/tmdb\/?/, "")
    .replace(/^\/\.netlify\/functions\/tmdb\/?/, "");

  const searchParams = new URLSearchParams(event.queryStringParameters || {});
  searchParams.set("api_key", process.env.TMDB_KEY);

  const tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?${searchParams.toString()}`;

  const response = await fetch(tmdbUrl);
  const body = await response.text();

  return {
    statusCode: response.status,
    headers: { "Content-Type": "application/json" },
    body,
  };
}
