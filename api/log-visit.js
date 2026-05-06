export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const webhookUrl = process.env.VITE_DISCORD_WEBHOOK

  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook not configured' })
  }

  try {
    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })

    if (!discordRes.ok) {
      const errText = await discordRes.text()
      return res.status(discordRes.status).json({ error: errText })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Webhook proxy error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
