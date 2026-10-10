import os
import math
import subprocess

WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION_SEC = 3
TOTAL_FRAMES = FPS * DURATION_SEC

TMP_DIR = "/tmp/hero_frames"
os.makedirs(TMP_DIR, exist_ok=True)

# Generate frames
for i in range(TOTAL_FRAMES):
    t = i / TOTAL_FRAMES  # 0 to 1
    # Cinematic camera dolly: slight zoom and perspective shift
    zoom = 1.0 + 0.05 * math.sin(t * math.pi * 2)
    pan_x = 10 * math.sin(t * math.pi * 2)
    
    # Pulse for security gate scan line
    scan_x = (math.sin(t * math.pi * 2) * 0.5 + 0.5) * WIDTH
    pulse_glow = 0.5 + 0.5 * math.sin(t * math.pi * 4)
    beam_opacity = 0.12 + 0.06 * math.sin(t * math.pi * 2 + 1.0)
    badge_pass_alpha = 0.7 + 0.3 * math.sin(t * math.pi * 2)

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" width="{WIDTH}" height="{HEIGHT}">
      <defs>
        <!-- Atrium Background Gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#08101e" />
          <stop offset="35%" stop-color="#0d1b2a" />
          <stop offset="65%" stop-color="#14263b" />
          <stop offset="100%" stop-color="#090f18" />
        </linearGradient>

        <!-- Floor Reflection Gradient -->
        <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0e1e30" stop-opacity="0.9" />
          <stop offset="40%" stop-color="#0a1523" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#040910" stop-opacity="1" />
        </linearGradient>

        <!-- Volumetric Cyan Sunbeam -->
        <linearGradient id="beamGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="{beam_opacity * 1.5}" />
          <stop offset="50%" stop-color="#0d9488" stop-opacity="{beam_opacity * 0.7}" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
        </linearGradient>

        <!-- Turnstile Stainless Steel Gradient -->
        <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="25%" stop-color="#64748b" />
          <stop offset="50%" stop-color="#cbd5e1" />
          <stop offset="75%" stop-color="#64748b" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>

        <!-- Glass Wing Barrier Gradient -->
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5" />
          <stop offset="50%" stop-color="#14b8a6" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#0f766e" stop-opacity="0.6" />
        </linearGradient>

        <!-- Optical Lane LED Indicator (Emerald / Teal) -->
        <linearGradient id="ledLaneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.1" />
          <stop offset="50%" stop-color="#2dd4bf" stop-opacity="{0.7 + 0.3 * pulse_glow}" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.1" />
        </linearGradient>

        <!-- Biometric Scan Ray -->
        <radialGradient id="scanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.8" />
          <stop offset="60%" stop-color="#0f766e" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#0f766e" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Background Sky & Atrium Glass -->
      <rect x="0" y="0" width="{WIDTH}" height="{HEIGHT}" fill="url(#bgGrad)" />

      <!-- Architectural Glass Curtain Wall Grid (Deep Perspective) -->
      <g stroke="#1e3a5f" stroke-width="1.5" opacity="0.4">
        <!-- Vertical Curtain Wall Mullions -->
        <line x1="{100 + pan_x * 0.2}" y1="0" x2="{40 + pan_x * 0.4}" y2="460" />
        <line x1="{260 + pan_x * 0.2}" y1="0" x2="{220 + pan_x * 0.4}" y2="460" />
        <line x1="{420 + pan_x * 0.2}" y1="0" x2="{400 + pan_x * 0.4}" y2="460" />
        <line x1="{580 + pan_x * 0.2}" y1="0" x2="{580 + pan_x * 0.4}" y2="460" />
        <line x1="{740 + pan_x * 0.2}" y1="0" x2="{760 + pan_x * 0.4}" y2="460" />
        <line x1="{900 + pan_x * 0.2}" y1="0" x2="{940 + pan_x * 0.4}" y2="460" />
        <line x1="{1060 + pan_x * 0.2}" y1="0" x2="{1120 + pan_x * 0.4}" y2="460" />
        <line x1="{1220 + pan_x * 0.2}" y1="0" x2="{1260 + pan_x * 0.4}" y2="460" />

        <!-- Horizontal Transoms -->
        <line x1="0" y1="80" x2="{WIDTH}" y2="80" stroke-width="1" />
        <line x1="0" y1="180" x2="{WIDTH}" y2="180" stroke-width="1.2" />
        <line x1="0" y1="290" x2="{WIDTH}" y2="290" stroke-width="1.5" />
        <line x1="0" y1="410" x2="{WIDTH}" y2="410" stroke-width="2" />
      </g>

      <!-- Atmospheric Volumetric Beams -->
      <polygon points="120,0 380,0 {820 + pan_x},720 {420 + pan_x},720" fill="url(#beamGrad)" />
      <polygon points="760,0 980,0 {1260 + pan_x},720 {960 + pan_x},720" fill="url(#beamGrad)" opacity="0.6" />

      <!-- High-End Polished Marble Floor with Horizon -->
      <rect x="0" y="440" width="{WIDTH}" height="280" fill="url(#floorGrad)" />
      <line x1="0" y1="440" x2="{WIDTH}" y2="440" stroke="#0ea5e9" stroke-width="0.8" opacity="0.3" />

      <!-- Floor Perspective Grid Lines (Specularity) -->
      <g stroke="#1e293b" stroke-width="1" opacity="0.5">
        <line x1="640" y1="440" x2="0" y2="720" />
        <line x1="640" y1="440" x2="220" y2="720" />
        <line x1="640" y1="440" x2="440" y2="720" />
        <line x1="640" y1="440" x2="640" y2="720" stroke="#0f766e" opacity="0.4" stroke-width="1.5" />
        <line x1="640" y1="440" x2="840" y2="720" />
        <line x1="640" y1="440" x2="1060" y2="720" />
        <line x1="640" y1="440" x2="{WIDTH}" y2="720" />
      </g>

      <!-- Floor Tile Joint Transoms -->
      <line x1="160" y1="480" x2="1120" y2="480" stroke="#1e293b" stroke-width="0.7" opacity="0.4" />
      <line x1="80" y1="540" x2="1200" y2="540" stroke="#1e293b" stroke-width="0.9" opacity="0.5" />
      <line x1="0" y1="620" x2="{WIDTH}" y2="620" stroke="#1e293b" stroke-width="1.2" opacity="0.6" />

      <!-- Optical Turnstile Gates (4 Units, 3 Lanes) -->
      <!-- Floor Reflections under Pedestals -->
      <ellipse cx="{300 + pan_x * 0.7}" cy="600" rx="34" ry="12" fill="#0f766e" opacity="0.25" />
      <ellipse cx="{520 + pan_x * 0.7}" cy="600" rx="34" ry="12" fill="#0f766e" opacity="0.3" />
      <ellipse cx="{740 + pan_x * 0.7}" cy="600" rx="34" ry="12" fill="#0f766e" opacity="0.3" />
      <ellipse cx="{960 + pan_x * 0.7}" cy="600" rx="34" ry="12" fill="#0f766e" opacity="0.25" />

      <!-- Optical Speed Gates Array -->
      <!-- Lane Ground Guidance LED Ribbons -->
      <rect x="{340 + pan_x * 0.7}" y="575" width="140" height="4" rx="2" fill="url(#ledLaneGrad)" />
      <rect x="{560 + pan_x * 0.7}" y="575" width="140" height="4" rx="2" fill="url(#ledLaneGrad)" />
      <rect x="{780 + pan_x * 0.7}" y="575" width="140" height="4" rx="2" fill="url(#ledLaneGrad)" />

      <!-- Pedestal 1 (Leftmost) -->
      <g transform="translate({270 + pan_x * 0.7}, 430)">
        <!-- Pedestal Body -->
        <rect x="0" y="20" width="60" height="150" rx="8" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
        <!-- Top Glass Lid -->
        <rect x="4" y="10" width="52" height="18" rx="4" fill="#090d16" stroke="#38bdf8" stroke-width="0.8" />
        <!-- Access Indicator Ring -->
        <circle cx="30" cy="19" r="5" fill="#14b8a6" filter="drop-shadow(0px 0px 4px #2dd4bf)" />
        <!-- LED Status Edge Bar -->
        <rect x="54" y="35" width="3" height="120" rx="1.5" fill="#2dd4bf" opacity="{badge_pass_alpha}" />
      </g>

      <!-- Glass Barrier 1 -->
      <polygon points="{335 + pan_x * 0.7},465 {405 + pan_x * 0.7},480 {405 + pan_x * 0.7},560 {335 + pan_x * 0.7},545" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="1" />

      <!-- Pedestal 2 (Center-Left) -->
      <g transform="translate({490 + pan_x * 0.7}, 420)">
        <rect x="0" y="20" width="60" height="160" rx="8" fill="url(#steelGrad)" stroke="#64748b" stroke-width="1.5" />
        <rect x="4" y="8" width="52" height="20" rx="4" fill="#090d16" stroke="#38bdf8" stroke-width="1" />
        <!-- Biometric Face / Card Reader Screen -->
        <rect x="12" y="12" width="36" height="12" rx="2" fill="#042f2e" />
        <circle cx="30" cy="18" r="4" fill="#2dd4bf" />
        <rect x="54" y="35" width="3" height="130" rx="1.5" fill="#2dd4bf" />
        <rect x="3" y="35" width="3" height="130" rx="1.5" fill="#2dd4bf" />
      </g>

      <!-- Glass Barrier 2 (Center Active Lane) -->
      <polygon points="{555 + pan_x * 0.7},455 {625 + pan_x * 0.7},470 {625 + pan_x * 0.7},550 {555 + pan_x * 0.7},535" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="1.2" />
      <polygon points="{675 + pan_x * 0.7},470 {605 + pan_x * 0.7},455 {605 + pan_x * 0.7},535 {675 + pan_x * 0.7},550" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="1.2" />

      <!-- Pedestal 3 (Center-Right) -->
      <g transform="translate({710 + pan_x * 0.7}, 420)">
        <rect x="0" y="20" width="60" height="160" rx="8" fill="url(#steelGrad)" stroke="#64748b" stroke-width="1.5" />
        <rect x="4" y="8" width="52" height="20" rx="4" fill="#090d16" stroke="#38bdf8" stroke-width="1" />
        <rect x="12" y="12" width="36" height="12" rx="2" fill="#042f2e" />
        <circle cx="30" cy="18" r="4" fill="#2dd4bf" />
        <rect x="54" y="35" width="3" height="130" rx="1.5" fill="#2dd4bf" />
        <rect x="3" y="35" width="3" height="130" rx="1.5" fill="#2dd4bf" />
      </g>

      <!-- Glass Barrier 3 -->
      <polygon points="{775 + pan_x * 0.7},465 {845 + pan_x * 0.7},480 {845 + pan_x * 0.7},560 {775 + pan_x * 0.7},545" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="1" />

      <!-- Pedestal 4 (Rightmost) -->
      <g transform="translate({930 + pan_x * 0.7}, 430)">
        <rect x="0" y="20" width="60" height="150" rx="8" fill="url(#steelGrad)" stroke="#475569" stroke-width="1.5" />
        <rect x="4" y="10" width="52" height="18" rx="4" fill="#090d16" stroke="#38bdf8" stroke-width="0.8" />
        <circle cx="30" cy="19" r="5" fill="#14b8a6" />
        <rect x="3" y="35" width="3" height="120" rx="1.5" fill="#2dd4bf" opacity="{badge_pass_alpha}" />
      </g>

      <!-- Biometric Laser Scanning Beam Sweeping Over Entry -->
      <circle cx="{scan_x}" cy="480" r="140" fill="url(#scanGlow)" opacity="{0.4 + 0.3 * pulse_glow}" />
      <line x1="{scan_x}" y1="360" x2="{scan_x}" y2="600" stroke="#2dd4bf" stroke-width="2" opacity="{0.7 * pulse_glow}" stroke-dasharray="4 4" />

      <!-- Modern Cyber Security HUD Overlay Markers -->
      <g opacity="0.35" font-family="monospace" font-size="10" fill="#2dd4bf">
        <text x="40" y="50">SECURITY PROTOCOL: ENFORCED</text>
        <text x="40" y="65">OPTICAL GATES: SYNCHRONIZED</text>
        <text x="{WIDTH - 240}" y="50">LATENCY: 12ms // SHA-256</text>
        <text x="{WIDTH - 240}" y="65">ACCESS CLEARANCE: LEVEL 4</text>
      </g>
    </svg>
    """
    with open(f"{TMP_DIR}/frame_{i:03d}.svg", "w") as f:
        f.write(svg)

print("Frames generated successfully.")
