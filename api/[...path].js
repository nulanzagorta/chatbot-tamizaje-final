// api/[...path].js
// Proxy catch-all para Assistants v2 en Vercel
export default async function handler(req, res) {
  try {
    // req.url llega como /api/lo-que-sea...
    // Removemos el prefijo /api para reenviar a OpenAI
    const upstreamPath = req.url.replace(/^\/api/, "");
    const upstreamURL = `https://api.openai.com/v1${upstreamPath}`;

    const body =
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : JSON.stringify(req.body ?? {});

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
    res.status(r.status).send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", detail: String(err) });
  }
}
