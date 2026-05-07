export const config = {
  api: { bodyParser: { sizeLimit: '20mb' } }
};

const REQUIREMENTS = [
  // 01 Enforcement Capabilities
  { key: 'capabilities:g0:r0',  req: 'Red Light (Fixed, Front/Rear)',           section: 'capabilities' },
  { key: 'capabilities:g0:r1',  req: 'Speed (Fixed, up to 6 lanes)',             section: 'capabilities' },
  { key: 'capabilities:g0:r2',  req: 'Speed — Mobile / Unattended',              section: 'capabilities' },
  { key: 'capabilities:g0:r3',  req: 'Secondary Speed Validation (in-camera SSV)', section: 'capabilities' },
  { key: 'capabilities:g0:r4',  req: 'Red Light + Speed (Intersection Safety)',  section: 'capabilities' },
  { key: 'capabilities:g0:r5',  req: 'Average Speed (Section) Enforcement',      section: 'capabilities' },
  { key: 'capabilities:g0:r6',  req: 'ALPR / ANPR (standalone or combined)',     section: 'capabilities' },
  { key: 'capabilities:g0:r7',  req: 'School Zone / Scheduled Enforcement',      section: 'capabilities' },
  { key: 'capabilities:g1:r0',  req: 'Block the Box / Yellow Box',               section: 'capabilities' },
  { key: 'capabilities:g1:r1',  req: 'Wrong Way Driving',                        section: 'capabilities' },
  { key: 'capabilities:g1:r2',  req: 'Illegal Turns / NTOR',                     section: 'capabilities' },
  { key: 'capabilities:g1:r3',  req: 'Stop Sign (Unmanned)',                     section: 'capabilities' },
  { key: 'capabilities:g1:r4',  req: 'Distracted Driving (Phone / Seat Belt)',   section: 'capabilities' },
  { key: 'capabilities:g1:r5',  req: 'Truck Over Height',                        section: 'capabilities' },
  { key: 'capabilities:g1:r6',  req: 'Rail Crossing',                            section: 'capabilities' },
  { key: 'capabilities:g1:r7',  req: 'Crosswalk / Stop on Crosswalk',            section: 'capabilities' },
  { key: 'capabilities:g1:r8',  req: 'Tailgating / Close Following',             section: 'capabilities' },
  { key: 'capabilities:g1:r9',  req: 'Lane / Restricted Lane Monitoring',        section: 'capabilities' },
  { key: 'capabilities:g1:r10', req: 'Moving Speed (in patrol car)',              section: 'capabilities' },
  // 02 Detection Technology
  { key: 'detection:r0',  req: 'Lidar',                     section: 'detection' },
  { key: 'detection:r1',  req: 'Radar',                     section: 'detection' },
  { key: 'detection:r2',  req: 'Video / AI Detection',      section: 'detection' },
  { key: 'detection:r3',  req: 'Inductive Loop',            section: 'detection' },
  { key: 'detection:r4',  req: '6 Lanes',                   section: 'detection' },
  { key: 'detection:r5',  req: '4 Lanes',                   section: 'detection' },
  { key: 'detection:r6',  req: '2 Lanes',                   section: 'detection' },
  { key: 'detection:r7',  req: 'Bi-Directional Enforcement',section: 'detection' },
  { key: 'detection:r8',  req: 'Speed Accuracy',            section: 'detection' },
  { key: 'detection:r9',  req: 'Vehicle Classification',    section: 'detection' },
  { key: 'detection:r10', req: 'Vehicle Overlay on Image',  section: 'detection' },
  { key: 'detection:r11', req: 'Face / Driver Capture',     section: 'detection' },
  // 03 Image Quality
  { key: 'image:r0',  req: 'Image Sensor',                  section: 'image' },
  { key: 'image:r1',  req: 'Still Camera Resolution',       section: 'image' },
  { key: 'image:r2',  req: 'Video Camera',                  section: 'image' },
  { key: 'image:r3',  req: 'Lenses',                        section: 'image' },
  { key: 'image:r4',  req: 'Cameras Per Enforcement Setup', section: 'image' },
  { key: 'image:r5',  req: 'Color Images — Day',            section: 'image' },
  { key: 'image:r6',  req: 'Color Images — Night',          section: 'image' },
  { key: 'image:r7',  req: 'Processing / OS',               section: 'image' },
  { key: 'image:r8',  req: 'Storage',                       section: 'image' },
  { key: 'image:r9',  req: 'Signal Detection',              section: 'image' },
  // 04 Functionality
  { key: 'functionality:r0',  req: 'Web-Based GUI',                                    section: 'functionality' },
  { key: 'functionality:r1',  req: 'Enforcement Scheduler (day-specific + holidays)',  section: 'functionality' },
  { key: 'functionality:r2',  req: 'Customizable Data Bar (fields + logo)',            section: 'functionality' },
  { key: 'functionality:r3',  req: 'Red Delay Control (to 0.01s)',                     section: 'functionality' },
  { key: 'functionality:r4',  req: 'A/B Shot Control (time or distance for B shot)',   section: 'functionality' },
  { key: 'functionality:r5',  req: 'Suppress 2nd Photo if Exit Speed < Entry',         section: 'functionality' },
  { key: 'functionality:r6',  req: 'Right on Red / NTOR Management',                  section: 'functionality' },
  { key: 'functionality:r7',  req: 'NTP Time Sync + Suspend if NTP Fails',             section: 'functionality' },
  { key: 'functionality:r8',  req: 'Remote Firmware + Config Updates',                 section: 'functionality' },
  { key: 'functionality:r9',  req: 'Lane-Specific Test Shot',                          section: 'functionality' },
  { key: 'functionality:r10', req: 'Incident Video with Configurable Pre/Post Buffer', section: 'functionality' },
  { key: 'functionality:r11', req: 'ALPR Hotlist / Whitelist / Blacklist',             section: 'functionality' },
  // 05 Physical
  { key: 'physical:r0',  req: 'Dimensions',               section: 'physical' },
  { key: 'physical:r1',  req: 'Weight',                   section: 'physical' },
  { key: 'physical:r2',  req: 'Construction',             section: 'physical' },
  { key: 'physical:r3',  req: 'Operating Temperature',    section: 'physical' },
  { key: 'physical:r4',  req: 'IP Rating',                section: 'physical' },
  { key: 'physical:r5',  req: 'IK (Impact) Rating',       section: 'physical' },
  { key: 'physical:r6',  req: 'Power Supply',             section: 'physical' },
  { key: 'physical:r7',  req: 'Solar / Battery Mobile',   section: 'physical' },
  { key: 'physical:r8',  req: 'Certifications Confirmed', section: 'physical' },
  { key: 'physical:r9',  req: 'Manufacture / Origin',     section: 'physical' },
  { key: 'physical:r10', req: 'Lighting / Flash',         section: 'physical' },
  // 06 Security
  { key: 'security:r0', req: 'Encryption (AES-256)',                section: 'security' },
  { key: 'security:r1', req: 'Image Watermarking / Signature',      section: 'security' },
  { key: 'security:r2', req: 'VPN Support',                         section: 'security' },
  { key: 'security:r3', req: 'Connection Options',                  section: 'security' },
  { key: 'security:r4', req: 'API (RESTful, inbound + outbound)',   section: 'security' },
  { key: 'security:r5', req: 'Multi-Camera Management Dashboard',   section: 'security' },
  // 07 Matrix
  { key: 'matrix:r0',  req: 'Red Light',                          section: 'matrix' },
  { key: 'matrix:r1',  req: 'Speed (Fixed, 4–6 lanes)',           section: 'matrix' },
  { key: 'matrix:r2',  req: 'Speed Mobile / Unattended',          section: 'matrix' },
  { key: 'matrix:r3',  req: 'Moving / In-Car Speed',              section: 'matrix' },
  { key: 'matrix:r4',  req: 'Average Speed (SECO / Section)',      section: 'matrix' },
  { key: 'matrix:r5',  req: 'Secondary Speed Validation (SSV)',    section: 'matrix' },
  { key: 'matrix:r6',  req: 'Intersection Safety (RL + Speed)',    section: 'matrix' },
  { key: 'matrix:r7',  req: 'Video Phase Detection (no cable)',    section: 'matrix' },
  { key: 'matrix:r8',  req: 'Block the Box',                      section: 'matrix' },
  { key: 'matrix:r9',  req: 'Wrong Way',                          section: 'matrix' },
  { key: 'matrix:r10', req: 'Illegal Turns / NTOR',               section: 'matrix' },
  { key: 'matrix:r11', req: 'Stop Sign (Unmanned)',                section: 'matrix' },
  { key: 'matrix:r12', req: 'Distracted Driving (Phone/Belt)',     section: 'matrix' },
  { key: 'matrix:r13', req: 'Face / Driver Capture',               section: 'matrix' },
  { key: 'matrix:r14', req: 'Truck Over Height',                   section: 'matrix' },
  { key: 'matrix:r15', req: 'Rail Crossing',                       section: 'matrix' },
  { key: 'matrix:r16', req: 'Crosswalk Enforcement',               section: 'matrix' },
  { key: 'matrix:r17', req: 'Tailgating',                          section: 'matrix' },
  { key: 'matrix:r18', req: 'Lane / Restricted Lane',              section: 'matrix' },
  { key: 'matrix:r19', req: 'ALPR / ANPR',                         section: 'matrix' },
  { key: 'matrix:r20', req: 'Web-Based GUI',                       section: 'matrix' },
  { key: 'matrix:r21', req: 'Day-Specific Scheduler',              section: 'matrix' },
  { key: 'matrix:r22', req: 'AES-256 Encryption',                  section: 'matrix' },
  { key: 'matrix:r23', req: 'Mobile Router Built-In',              section: 'matrix' },
  { key: 'matrix:r24', req: 'US / North America Manufacture',      section: 'matrix' },
];

const SYSTEM_PROMPT = `You are analyzing vendor documentation for traffic enforcement camera systems. Your job is to extract structured capability data that will populate a comparison tool.

You will be given a document and a list of requirements. For each requirement, determine what the document says.

Use these status values ONLY:
- "confirmed"  — document explicitly and clearly confirms this capability is supported/available
- "partial"    — document mentions it but with limitations, as optional, or in development/roadmap
- "notmet"     — document explicitly states this is NOT supported or not available
- "unknown"    — document does not mention this capability at all

For "image" and "physical" section requirements, the status should be "text" with the actual spec value as the note (e.g. note: "1920×1080 CMOS" for Still Camera Resolution).

Also identify capabilities mentioned in the document that are NOT in the requirements list — these are candidates for new requirements.

Return ONLY valid JSON. No markdown, no explanation, just the JSON object.`;

function buildUserPrompt(vendorName, fileName) {
  const reqList = REQUIREMENTS.map(r => `  {"key":"${r.key}","req":"${r.req}","section":"${r.section}"}`).join(',\n');
  return `Vendor: ${vendorName}
Document: ${fileName}

Requirements to evaluate:
[
${reqList}
]

Return JSON in exactly this format:
{
  "findings": [
    {"key":"capabilities:g0:r0","req":"Red Light (Fixed, Front/Rear)","section":"capabilities","status":"confirmed","note":"Brief evidence (max 150 chars)"}
  ],
  "new_capabilities": [
    {"name":"Capability Name","description":"Brief description from the document (max 150 chars)"}
  ]
}

Include ALL ${REQUIREMENTS.length} requirements in findings. For specs sections (image, physical) use status "text" with the spec value as the note.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on this deployment.' });
  }

  const { vendorId, vendorName, fileName, fileType, fileBase64 } = req.body || {};

  if (!vendorId || !fileBase64 || !fileType) {
    return res.status(400).json({ error: 'Missing required fields: vendorId, fileType, fileBase64' });
  }

  const supportedTypes = ['application/pdf'];
  if (!supportedTypes.includes(fileType)) {
    return res.status(400).json({ error: `Unsupported file type: ${fileType}. Please upload a PDF.` });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: fileType, data: fileBase64 }
            },
            {
              type: 'text',
              text: buildUserPrompt(vendorName || vendorId, fileName || 'document.pdf')
            }
          ]
        }]
      })
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      console.error('Anthropic API error:', anthropicRes.status, errBody);
      return res.status(502).json({ error: `Anthropic API error ${anthropicRes.status}: ${errBody.slice(0, 200)}` });
    }

    const anthropicData = await anthropicRes.json();
    const rawText = anthropicData.content?.[0]?.text || '';

    // Extract JSON from response (strip any accidental markdown fences)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Claude response:', rawText.slice(0, 500));
      return res.status(502).json({ error: 'Could not parse structured response from AI.' });
    }

    const result = JSON.parse(jsonMatch[0]);
    result.vendorId   = vendorId;
    result.vendorName = vendorName || vendorId;
    result.fileName   = fileName || 'document.pdf';
    result.analyzedAt = new Date().toISOString();

    return res.status(200).json(result);
  } catch (err) {
    console.error('analyze-doc error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
