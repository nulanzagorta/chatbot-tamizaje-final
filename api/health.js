export default function handler(req, res) {
  res.status(200).json({ ok: true, service: "epimex-proxy", time: new Date().toISOString() });
}
