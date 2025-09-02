// api/[...path].js
// Proxy catch-all para OpenAI Assistants v2 con CORS habilitado

export default async function handler(req, res) {
  // CORS headers
  const origin = req.headers.origin || "*";
  const cors = {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, OpenAI-Beta",
    "Access-Control-Expose-Headers": "Content-Type",
    "Cache-Control": "no-store"
  };

  // 1) Preflight
  if (req.method === "OPTIONS") {
    Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(204).end();
  }

  try {
    // 2) Reenvío a OpenAI
    const upstreamPath = req.url.replace(/^\/api/, "");
    const upstreamURL = `https://api.openai.com/v1${upstreamPath}`;

    // Cuerpo solo para métodos con payload
    const hasBody = !["GET", "HEAD"].includes(req.method);
    const body = hasBody ? JSON.stringify(req.body ?? {}) : undefined;

    const r = await fetch(upstreamURL, {
      method: req.method,
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body
    });

    const text = await r.text();

    // 3) Responder + CORS
    Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(r.status).send(text);
  } catch (err) {
    Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(500).json({ error: "Proxy error", detail: String(err) });
  }
}
