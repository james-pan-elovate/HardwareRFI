const SESSION_SECRET = process.env.SESSION_SECRET

async function verifySessionToken(token) {
  if (!token || !SESSION_SECRET) return false
  const dot = token.lastIndexOf('.')
  if (dot === -1) return false

  const encoded = token.slice(0, dot)
  const sig = token.slice(dot + 1)

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  // base64url → base64 for atob
  const b64 = (s) => s.replace(/-/g, '+').replace(/_/g, '/')
  let sigBytes
  try {
    sigBytes = Uint8Array.from(atob(b64(sig)), (c) => c.charCodeAt(0))
  } catch {
    return false
  }

  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(encoded))
  if (!valid) return false

  try {
    const { exp } = JSON.parse(atob(b64(encoded)))
    if (!exp || Date.now() > exp) return false
    return true
  } catch {
    return false
  }
}

const LOGIN_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Elovate — Sign In</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.card{background:#1e293b;border:1px solid #334155;border-radius:16px;padding:40px;width:100%;max-width:420px;box-shadow:0 25px 50px rgba(0,0,0,.5)}
.logo{font-size:20px;font-weight:700;color:#f8fafc;margin-bottom:4px;letter-spacing:-.5px}
.logo span{color:#38bdf8}
.sub{font-size:13px;color:#64748b;margin-bottom:32px}
h2{font-size:19px;font-weight:600;color:#f1f5f9;margin-bottom:4px}
.step-desc{font-size:13px;color:#64748b;margin-bottom:24px}
label{display:block;font-size:13px;font-weight:500;color:#94a3b8;margin-bottom:8px}
input{width:100%;padding:12px 14px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#f1f5f9;font-size:15px;outline:none;transition:border-color .15s}
input:focus{border-color:#38bdf8}
input::placeholder{color:#475569}
.otp{letter-spacing:12px;font-size:24px;font-weight:700;text-align:center}
button.primary{width:100%;padding:13px;background:#0ea5e9;color:#fff;font-size:15px;font-weight:600;border:none;border-radius:8px;cursor:pointer;margin-top:16px;transition:background .15s}
button.primary:hover:not(:disabled){background:#38bdf8}
button.primary:disabled{opacity:.5;cursor:not-allowed}
.err{background:#450a0a;border:1px solid #7f1d1d;color:#fca5a5;border-radius:8px;padding:12px 14px;font-size:13px;margin-top:14px;display:none}
.ok{background:#052e16;border:1px solid #166534;color:#86efac;border-radius:8px;padding:12px 14px;font-size:13px;margin-top:14px;display:none}
.back{background:none;border:none;color:#64748b;font-size:13px;cursor:pointer;margin-top:10px;text-decoration:underline;padding:4px 0;display:block}
.back:hover{color:#94a3b8}
#s2{display:none}
</style>
</head>
<body>
<div class="card">
  <div class="logo">Elovate <span>◆</span></div>
  <div class="sub">Vendor Benchmark Platform</div>

  <div id="s1">
    <h2>Sign in</h2>
    <div class="step-desc">Enter your Elovate email to receive a one-time code</div>
    <label>Email address</label>
    <input id="email" type="email" placeholder="you@elovate.com" autocomplete="email">
    <button class="primary" id="sendBtn" onclick="send()">Send verification code</button>
    <div class="err" id="e1"></div>
  </div>

  <div id="s2">
    <h2>Check your email</h2>
    <div class="step-desc" id="desc2">Enter the 6-digit code we sent you</div>
    <label>Verification code</label>
    <input id="otp" class="otp" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="000000" autocomplete="one-time-code">
    <button class="primary" id="verifyBtn" onclick="verify()">Verify &amp; sign in</button>
    <div class="err" id="e2"></div>
    <div class="ok" id="ok2">Signed in! Redirecting…</div>
    <button class="back" onclick="back()">← Use a different email</button>
  </div>
</div>
<script>
let pt=null,em=null
document.getElementById('email').onkeydown=e=>{if(e.key==='Enter')send()}
document.getElementById('otp').onkeydown=e=>{if(e.key==='Enter')verify()}

async function send(){
  const e=document.getElementById('email').value.trim()
  const btn=document.getElementById('sendBtn')
  const err=document.getElementById('e1')
  err.style.display='none'
  if(!e){show(err,'Please enter your email address');return}
  btn.disabled=true;btn.textContent='Sending…'
  try{
    const r=await fetch('/api/auth/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e})})
    const d=await r.json()
    if(!r.ok){show(err,d.error||'Failed to send code');btn.disabled=false;btn.textContent='Send verification code';return}
    pt=d.pendingToken;em=e.trim().toLowerCase()
    document.getElementById('s1').style.display='none'
    document.getElementById('s2').style.display='block'
    document.getElementById('desc2').textContent='We sent a 6-digit code to '+e
    document.getElementById('otp').focus()
  }catch{show(err,'Network error — please try again');btn.disabled=false;btn.textContent='Send verification code'}
}

async function verify(){
  const code=document.getElementById('otp').value.trim()
  const btn=document.getElementById('verifyBtn')
  const err=document.getElementById('e2')
  err.style.display='none'
  if(code.length!==6){show(err,'Please enter the 6-digit code from your email');return}
  btn.disabled=true;btn.textContent='Verifying…'
  try{
    const r=await fetch('/api/auth/verify-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:em,otp:code,pendingToken:pt})})
    const d=await r.json()
    if(!r.ok){show(err,d.error||'Verification failed');btn.disabled=false;btn.textContent='Verify & sign in';return}
    document.getElementById('ok2').style.display='block'
    setTimeout(()=>location.href='/',600)
  }catch{show(err,'Network error — please try again');btn.disabled=false;btn.textContent='Verify & sign in'}
}

function back(){
  document.getElementById('s2').style.display='none'
  document.getElementById('s1').style.display='block'
  document.getElementById('sendBtn').disabled=false
  document.getElementById('sendBtn').textContent='Send verification code'
  pt=null;em=null
}

function show(el,msg){el.textContent=msg;el.style.display='block'}
</script>
</body>
</html>`

export default async function middleware(request) {
  const { pathname } = new URL(request.url)

  // Auth endpoints must pass through unauthenticated
  if (pathname.startsWith('/api/auth/')) return

  // Validate session cookie
  const cookie = request.headers.get('cookie') ?? ''
  const match = cookie.match(/(?:^|;\s*)session=([^;]+)/)
  const token = match?.[1]

  if (token && await verifySessionToken(token)) return // valid session

  // No valid session → serve login page
  return new Response(LOGIN_PAGE, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export const config = {
  matcher: ['/((?!_next/).*)'],
}
