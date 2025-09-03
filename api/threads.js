export default async function handler(req, res) {
  const r = await fetch("https://api.openai.com/v1/threads", {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Beta": "assistants=v2"
    },
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined
  });

  const data = await r.json();
  res.status(r.status).json(data);
}
