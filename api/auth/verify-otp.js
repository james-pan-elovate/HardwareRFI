import { createHmac, createHash, createDecipheriv, timingSafeEqual } from 'crypto'

const SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 hours

function sign(data) {
  return createHmac('sha256', process.env.SESSION_SECRET).update(data).digest('base64url')
}

function aesKey() {
  return createHash('sha256').update('otp-enc:' + process.env.SESSION_SECRET).digest()
}

function decryptOtp(encryptedOtp) {
  const buf = Buffer.from(encryptedOtp, 'base64url')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const enc = buf.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', aesKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}

function verifyPendingToken(token) {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return null

  const encoded = token.slice(0, dot)
  const sig = token.slice(dot + 1)

  const expected = sign(encoded)
  try {
    const sigBuf = Buffer.from(sig, 'base64url')
    const expBuf = Buffer.from(expected, 'base64url')
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null
  } catch {
    return null
  }

  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

function createSessionToken(email) {
  const payload = Buffer.from(JSON.stringify({
    email,
    iat: Date.now(),
    exp: Date.now() + SESSION_EXPIRY_MS,
  })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, otp, pendingToken } = req.body ?? {}
  if (!email || !otp || !pendingToken) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const addr = email.trim().toLowerCase()
  const code = String(otp).trim()

  const pending = verifyPendingToken(pendingToken)
  if (!pending) return res.status(401).json({ error: 'Invalid or expired verification session' })
  if (Date.now() > pending.exp) return res.status(401).json({ error: 'Code expired — please request a new one' })
  if (pending.email !== addr) return res.status(401).json({ error: 'Verification mismatch' })

  let decrypted
  try {
    decrypted = decryptOtp(pending.encryptedOtp)
  } catch {
    return res.status(401).json({ error: 'Invalid verification session' })
  }

  const got = Buffer.from(code, 'utf8')
  const want = Buffer.from(decrypted, 'utf8')
  if (got.length !== want.length || !timingSafeEqual(got, want)) {
    return res.status(401).json({ error: 'Incorrect verification code' })
  }

  const sessionToken = createSessionToken(addr)

  // Session cookie — no Max-Age so it expires when the browser closes
  res.setHeader('Set-Cookie',
    `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/`
  )
  return res.status(200).json({ success: true })
}
