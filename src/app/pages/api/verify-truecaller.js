import crypto from 'crypto';

const TRUECALLER_SECRET = 'Gss6fb6b29e47633c44a9961e8a8a39960058'; // 🔁 Replace with your actual secret

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { payload, signature } = req.body;

  if (!payload || !signature) {
    return res.status(400).json({ error: 'Missing payload or signature' });
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', TRUECALLER_SECRET)
      .update(payload)
      .digest('base64');

    if (expectedSignature !== signature) {
      return res.status(403).json({ error: 'Invalid signature' });
    }

    const decoded = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8')
    );

    res.status(200).json(decoded);
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: 'Server error' });
  }
}
