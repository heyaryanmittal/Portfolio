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
        const getDeviceInfo = async () => {
          const ua = navigator.userAgent;
          const uad = navigator.userAgentData;
          
          let browser = "Unknown Browser";
          let os = "Unknown OS";
          let model = "";

          if (uad) {
            // Modern browsers (Chrome, Edge, etc.)
            const brand = uad.brands.find(b => b.brand !== 'Not A;Brand');
            browser = brand ? brand.brand : "Unknown Browser";
            os = uad.platform || "Unknown OS";
            
            try {
              const entropy = await uad.getHighEntropyValues(['model', 'platformVersion', 'architecture']);
              if (entropy.model && entropy.model !== "") {
                model = ` (${entropy.model})`;
              } else if (ua.includes("Windows")) {
                // If model is empty on Windows, it often means it's a PC
                model = " (PC)";
              }
              if (entropy.platformVersion) {
                // platformVersion for Windows is usually the major version or build
                // but it's hard to map precisely to 10/11 without a map.
              }
            } catch (e) {}
          } else {
            // Fallback to legacy UA parsing
            if (ua.includes("Firefox/")) browser = "Firefox";
            else if (ua.includes("Edg/")) browser = "Edge";
            else if (ua.includes("Chrome/")) browser = "Chrome";
            else if (ua.includes("Safari/")) browser = "Safari";
            else if (ua.includes("MSIE") || ua.includes("Trident/")) browser = "Internet Explorer";

            if (ua.includes("Windows")) os = "Windows";
            else if (ua.includes("Macintosh")) os = "macOS";
            else if (ua.includes("Android")) {
              const match = ua.match(/Android\s([0-9\.]+)/);
              os = match ? `Android ${match[1]}` : "Android";
              const modelMatch = ua.match(/Android.*;\s([^;]+)\sBuild/);
              if (modelMatch) model = ` (${modelMatch[1]})`;
            }
            else if (ua.includes("iPhone")) os = "iPhone";
            else if (ua.includes("iPad")) os = "iPad";
            else if (ua.includes("Linux")) os = "Linux";
          }

          return `${os}${model} | ${browser}`;
        };
        const deviceInfo = await getDeviceInfo();

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
                name: "📱 Device & Browser",
                value: `**Info:** \`${deviceInfo}\``,
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

        await fetch('/api/log-visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          })
          
          sessionStorage.setItem('visited_logged', 'true')

      } catch (error) {
        console.error('Logger Error:', error)
      }
    }

    logVisit()
  }, [isMobile])

  return null
}
