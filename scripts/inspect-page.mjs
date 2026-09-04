import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

await mkdir('lab/inspection', { recursive: true })

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'reduced', width: 390, height: 844, reducedMotion: 'reduce' },
]) {
  const { name, width, height, reducedMotion = 'no-preference' } = viewport
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion })
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(`${message.type()}: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
  await page.screenshot({ path: `lab/inspection/${name}-top.png`, fullPage: false })

  const states = []
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  for (const fraction of [0, 0.18, 0.36, 0.58, 0.78, 1]) {
    await page.evaluate((y) => scrollTo(0, y), maxScroll * fraction)
    await page.waitForTimeout(180)
    states.push(await page.evaluate((fraction) => ({
      fraction,
      scrollY,
      documentHeight: document.documentElement.scrollHeight,
      viewportHeight: innerHeight,
      visibleCopies: [...document.querySelectorAll('[data-sc-copy]')]
        .filter((element) => Number.parseFloat(getComputedStyle(element).opacity) > 0.5)
        .map((element) => ({
          heading: element.querySelector('h1,h2')?.textContent.trim(),
          opacity: getComputedStyle(element).opacity,
          visibility: getComputedStyle(element).visibility,
          display: getComputedStyle(element).display,
        })),
      activeRoute: document.querySelector('.route-stop[aria-current="step"]')?.textContent.trim(),
    }), fraction))
  }

  await page.evaluate((y) => scrollTo(0, y), maxScroll * 0.58)
  await page.waitForTimeout(220)
  await page.screenshot({ path: `lab/inspection/${name}-experience.png`, fullPage: false })
  console.log(JSON.stringify({ viewport, errors, states }, null, 2))
  await page.close()
}

await browser.close()
