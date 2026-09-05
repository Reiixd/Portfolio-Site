import { useEffect, useRef } from 'react'

const route = [
  [0.17, 0.74],
  [0.29, 0.61],
  [0.41, 0.67],
  [0.53, 0.48],
  [0.66, 0.57],
  [0.78, 0.36],
  [0.9, 0.24],
]

const satellites = [
  [-0.24, -0.16],
  [-0.12, -0.3],
  [0.16, -0.26],
  [0.29, -0.08],
  [0.24, 0.19],
  [0.02, 0.31],
  [-0.22, 0.22],
]

function line(ctx, a, b, alpha = 1, width = 1) {
  ctx.globalAlpha = alpha
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(a[0], a[1])
  ctx.lineTo(b[0], b[1])
  ctx.stroke()
}

export default function WorldCanvas({ worldRef, totalWeight }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let width = 0
    let height = 0
    let dpr = 1
    let palette

    const readPalette = () => {
      const styles = getComputedStyle(document.documentElement)
      return {
        canvas: styles.getPropertyValue('--sc-canvas').trim() || 'oklch(0.1 0 0)',
        surface: styles.getPropertyValue('--sc-surface').trim() || 'oklch(0.16 0.012 210)',
        primary: styles.getPropertyValue('--sc-primary').trim() || 'oklch(0.58 0.09 210)',
        accent: styles.getPropertyValue('--sc-accent').trim() || 'oklch(0.89 0.19 108)',
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      palette = readPalette()
      draw()
    }

    const getProgress = () => {
      const root = worldRef.current
      if (!root) return 0
      const top = root.getBoundingClientRect().top + window.scrollY
      return Math.min(1, Math.max(0, (window.scrollY - top) / (totalWeight * window.innerHeight)))
    }

    const drawBuildings = (progress) => {
      const horizon = height * (0.42 - progress * 0.08)
      ctx.strokeStyle = palette.primary
      ctx.fillStyle = palette.surface

      for (let i = 0; i < 18; i += 1) {
        const lane = i / 17
        const depth = 0.25 + lane * 0.75
        const drift = reduceMotion.matches ? 0 : progress * width * (0.02 + depth * 0.08)
        const bw = width * (0.025 + ((i * 7) % 5) * 0.009)
        const bh = height * (0.08 + ((i * 11) % 9) * 0.035) * (0.55 + progress * 0.85)
        const x = ((i * width * 0.091 + width * 0.33 - drift) % (width * 1.2)) - width * 0.08
        const y = horizon + height * 0.24 * depth - bh
        ctx.globalAlpha = 0.08 + depth * 0.16
        ctx.fillRect(x, y, bw, bh)
        ctx.globalAlpha = 0.2 + depth * 0.25
        ctx.strokeRect(x, y, bw, bh)

        for (let row = 0; row < 4; row += 1) {
          const wy = y + 12 + row * 18
          if (wy > y + bh - 8) break
          ctx.globalAlpha = ((i + row) % 4 === 0 ? 0.5 : 0.15) * (0.4 + progress)
          ctx.fillStyle = (i + row) % 4 === 0 ? palette.accent : palette.primary
          ctx.fillRect(x + 8, wy, 3, 3)
          ctx.fillStyle = palette.surface
        }
      }

      ctx.strokeStyle = palette.primary
      const vanishing = [width * (0.68 + progress * 0.08), horizon]
      for (let i = -5; i <= 8; i += 1) {
        line(ctx, [width * (i / 7), height], vanishing, 0.08 + progress * 0.11)
      }
      for (let i = 0; i < 8; i += 1) {
        const y = horizon + Math.pow(i / 7, 1.7) * (height - horizon)
        line(ctx, [0, y], [width, y], 0.06 + progress * 0.08)
      }
    }

    const drawRoute = (progress) => {
      const reveal = Math.min(1, progress * 1.35)
      const points = route.map(([x, y]) => [x * width, y * height])
      ctx.strokeStyle = palette.primary

      for (let i = 0; i < points.length - 1; i += 1) {
        const start = i / (points.length - 1)
        const end = (i + 1) / (points.length - 1)
        if (reveal <= start) break
        const local = Math.min(1, (reveal - start) / (end - start))
        const target = [
          points[i][0] + (points[i + 1][0] - points[i][0]) * local,
          points[i][1] + (points[i + 1][1] - points[i][1]) * local,
        ]
        line(ctx, points[i], target, 0.78, 1.25)
      }

      points.forEach((point, index) => {
        if (index / (points.length - 1) > reveal + 0.02) return
        const active = Math.round(reveal * (points.length - 1)) === index
        ctx.globalAlpha = active ? 1 : 0.72
        ctx.fillStyle = active ? palette.accent : palette.canvas
        ctx.strokeStyle = active ? palette.accent : palette.primary
        ctx.lineWidth = active ? 2 : 1.25
        ctx.beginPath()
        ctx.arc(point[0], point[1], active ? 7 : 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })
    }

    const drawConstellation = (progress) => {
      const local = Math.min(1, Math.max(0, (progress - 0.43) / 0.3))
      if (local <= 0) return
      const centre = [width * 0.67, height * 0.53]
      const radius = Math.min(width, height) * (0.34 + local * 0.08)
      const pts = satellites.map(([x, y]) => [centre[0] + x * radius, centre[1] + y * radius])
      const visible = Math.ceil(local * pts.length)
      ctx.strokeStyle = palette.primary

      pts.slice(0, visible).forEach((point, index) => {
        line(ctx, centre, point, 0.22 + local * 0.55, 1)
        if (index > 0) line(ctx, pts[index - 1], point, 0.18 + local * 0.35, 1)
        ctx.fillStyle = palette.canvas
        ctx.strokeStyle = palette.primary
        ctx.globalAlpha = 0.85
        ctx.beginPath()
        ctx.arc(point[0], point[1], 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })

      const pulse = reduceMotion.matches ? 9 : 8 + Math.sin(performance.now() / 260) * 2
      ctx.fillStyle = palette.accent
      ctx.strokeStyle = palette.accent
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(centre[0], centre[1], pulse, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.45
      ctx.beginPath()
      ctx.arc(centre[0], centre[1], 18 + local * 12, 0, Math.PI * 2)
      ctx.stroke()
    }

    const draw = () => {
      frame = 0
      const progress = getProgress()
      const root = worldRef.current
      root?.style.setProperty('--journey', progress.toFixed(4))
      ctx.globalAlpha = 1
      ctx.fillStyle = palette.canvas
      ctx.fillRect(0, 0, width, height)
      drawBuildings(progress)
      drawRoute(progress)
      drawConstellation(progress)
      ctx.globalAlpha = 1
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const updatePalette = () => {
      palette = readPalette()
      schedule()
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('portfolio:themechange', updatePalette)

    let pulseFrame
    const pulse = () => {
      if (getProgress() > 0.43 && getProgress() < 0.78 && !reduceMotion.matches) draw()
      pulseFrame = requestAnimationFrame(pulse)
    }
    pulseFrame = requestAnimationFrame(pulse)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('portfolio:themechange', updatePalette)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(pulseFrame)
    }
  }, [totalWeight, worldRef])

  return <canvas ref={canvasRef} className="world-canvas" aria-hidden="true" />
}
