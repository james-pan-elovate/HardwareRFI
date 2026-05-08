import { createHmac, createHash, createCipheriv, randomBytes, randomInt } from 'crypto'

const ALLOWED_DOMAIN = 'elovate.com'
const OTP_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

function sign(data) {
  return createHmac('sha256', process.env.SESSION_SECRET).update(data).digest('base64url')
}

// Derive a separate AES key so the signing key and encryption key never overlap
function aesKey() {
  return createHash('sha256').update('otp-enc:' + process.env.SESSION_SECRET).digest()
}

function encryptOtp(otp) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', aesKey(), iv)
  const enc = Buffer.concat([cipher.update(otp, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  // iv (12) + tag (16) + ciphertext (≤6 bytes)
  return Buffer.concat([iv, tag, enc]).toString('base64url')
}

function createPendingToken(email, otp) {
  const payload = Buffer.from(JSON.stringify({
    email,
    encryptedOtp: encryptOtp(otp),
    exp: Date.now() + OTP_EXPIRY_MS,
  })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body ?? {}
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email is required' })

  const addr = email.trim().toLowerCase()
  if (!addr.endsWith(`@${ALLOWED_DOMAIN}`)) {
    return res.status(403).json({ error: `Access is restricted to @${ALLOWED_DOMAIN} addresses` })
  }
  if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(addr)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const otp = String(randomInt(100000, 1000000))
  const pendingToken = createPendingToken(addr, otp)

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL ?? `noreply@${ALLOWED_DOMAIN}`,
      to: addr,
      subject: 'Your Elovate verification code',
      html: `
        <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:24px">
          <p style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:4px">Elovate Vendor Benchmark</p>
          <p style="color:#475569;margin-bottom:24px">Sign-in verification code</p>
          <div style="font-size:36px;font-weight:700;letter-spacing:10px;text-align:center;padding:20px;background:#f8fafc;border-radius:8px;color:#0f172a;margin-bottom:20px">${otp}</div>
          <p style="color:#64748b;font-size:13px">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>`,
    }),
  })

  if (!emailRes.ok) {
    console.error('Resend error:', await emailRes.text())
    return res.status(500).json({ error: 'Failed to send verification email. Check FROM_EMAIL and RESEND_API_KEY.' })
  }

  return res.status(200).json({ pendingToken })
}
