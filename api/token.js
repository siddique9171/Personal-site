const crypto = require("crypto");

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const expected = process.env.ADMIN_PASSWORD;
  const token = process.env.GITHUB_TOKEN;
  if (!expected || !token) {
    return res.status(500).json({
      error: "Server not configured: set ADMIN_PASSWORD and GITHUB_TOKEN in Vercel > Settings > Environment Variables, then redeploy."
    });
  }
  const password = (req.body && req.body.password) || "";
  if (!safeEqual(password, expected)) {
    return res.status(401).json({ error: "Wrong admin password." });
  }
  return res.status(200).json({ token });
};
