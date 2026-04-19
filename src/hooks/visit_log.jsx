import { useEffect } from 'react'
import useMobile from './useMobile'

export default function VisitorLogger() {
  const isMobile = useMobile()

  useEffect(() => {
    const logVisit = async () => {
      // Check if we've already logged this session
      if (sessionStorage.getItem('visited_logged')) return

      try {
        // --- 1. GATHER DATA ---
        
        // A. Network Identity (Prioritize IPv4)
        const [ipRes, locRes] = await Promise.all([
          fetch('https://api.ipify.org?format=json'),
          fetch('https://ipapi.co/json/')
        ]).catch(() => [null, null])

        let userIp = 'Unknown'
        let data = { city: 'Unknown', region: 'Unknown', country_name: 'Unknown', org: 'Unknown' }

        if (ipRes) {
          const ipData = await ipRes.json()
          userIp = ipData.ip
        }
        if (locRes) {
          data = await locRes.json()
        }

        // B. Hardware Fingerprint
        const getGPU = () => {
          try {
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
            return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown GPU'
          } catch (e) { return 'Unknown GPU' }
        }
        const gpu = getGPU()

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        const connType = connection ? connection.effectiveType : 'Unknown'
        const connSpeed = connection ? `${connection.downlink} Mbps` : 'Unknown'
        
        const cores = navigator.hardwareConcurrency || 'Unknown'
        const ram = navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : 'Unknown'
        const screenRes = `${window.screen.width}x${window.screen.height}`
        const pixelRatio = window.devicePixelRatio || 1
        
        let batteryInfo = 'Unknown'
        try {
          if (navigator.getBattery) {
            const battery = await navigator.getBattery()
            const level = Math.round(battery.level * 100) + '%'
            const charging = battery.charging ? '⚡' : '🔋'
            batteryInfo = `${level} (${charging})`
          }
        } catch (e) {}

        const referrer = document.referrer || 'Direct / Bookmark'
        const currentPath = window.location.pathname
        
        const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' }
        const localTime = `${new Date().toLocaleDateString('en-GB', dateOptions)}, ${new Date().toLocaleTimeString()}`
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

        // --- 2. FORMAT DISCORD MESSAGE ---
        const message = {
          embeds: [{
            title: "👤 New Visitor Detected",
            color: 0x2f3136, 
            fields: [
              { 
                name: "🏠 Identity", 
                value: `**IP:** \`${userIp}\`\n**Location:** ${data.city}, ${data.region}, ${data.country_name}\n📍 [View on Google Maps](https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude})`, 
                inline: false 
              },
              { 
                name: "🔗 Origin", 
                value: `**Source:** ${referrer}`, 
                inline: true 
              },
              { 
                name: "🕒 Timing", 
                value: `**Local Time:** ${localTime}`, 
                inline: true 
              },
              { 
                name: "🌐 Network", 
                value: `**Type:** ${connType} (${connSpeed})\n**Provider:** ${data.org || 'Unknown'}`, 
                inline: false 
              },
              { 
                name: "💻 Hardware", 
                value: `**Cores:** ${cores} | **RAM:** ${ram}\n**GPU:** \`${gpu}\``, 
                inline: false 
              },
              { 
                name: "📏 Display & Environment", 
                value: `**Res:** ${screenRes} (${pixelRatio}x)\n**Theme:** ${isDarkMode ? '🌙 Dark' : '☀️ Light'}\n**Power:** ${batteryInfo}`, 
                inline: false 
              }
            ],
            footer: { text: `Target: ${isMobile ? 'MOBILE' : 'DESKTOP'} | Path: ${currentPath}` },
            timestamp: new Date().toISOString()
          }]
        }

        const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK || "https://discord.com/api/webhooks/1495473055533891749/A7siL8MqyCGbAyND67Om6x9ZaWn1o2Cmtt010WQjtrmygeHdO937x2lm1fPmftWkdKQ8"
        
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          })
          
          sessionStorage.setItem('visited_logged', 'true')
        }

      } catch (error) {
        console.error('Logger Error:', error)
      }
    }

    logVisit()
  }, [isMobile])

  return null
}
