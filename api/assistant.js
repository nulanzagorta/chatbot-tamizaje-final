// api/assistant.js
// Proxy mínimo para OpenAI Assistants v2 en Vercel
export default async function handler(req, res) {
  try {
    // Quita el prefijo /api de la ruta
    const upstreamPath = req.url.replace(/^\/api/, "");
    const upstreamURL = `https://api.openai.com/v1${upstreamPath}`;

    // Cuerpo para métodos con payload
    const body = ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body ?? {});

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
