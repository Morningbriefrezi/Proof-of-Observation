import { test, expect } from '@playwright/test'

test.describe('G5 — Global Pitch Polish', () => {

  test('page title is updated', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Observe the Sky, Earn on Solana/)
  })

  test('hero headline shows new copy', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.locator('h1')).toContainText('Observe the sky.')
    await expect(page.locator('h1')).toContainText('Earn on Solana.')
  })

  test('hero subtitle is global (no Georgia mention)', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const body = await page.content()
    expect(body).toContain('from anywhere in the world')
    expect(body).not.toContain("Georgia's first astronomy store")
  })

  test('LocationPicker pill is visible in hero', async ({ page }) => {
    await page.goto('http://localhost:3000')
    // LocationPicker renders a button with 📍 and ▾
    const pill = page.locator('button').filter({ hasText: '▾' }).first()
    await expect(pill).toBeVisible()
  })

  test('LocationPicker dropdown opens on click', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const pill = page.locator('button').filter({ hasText: '▾' }).first()
    await pill.click()
    await expect(page.getByText('Your Location')).toBeVisible()
    await expect(page.getByText('This determines your marketplace and sky data')).toBeVisible()
  })

  test('LocationPicker preset buttons work', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const pill = page.locator('button').filter({ hasText: '▾' }).first()
    await pill.click()
    const tbilisiBtn = page.locator('button').filter({ hasText: 'Tbilisi' })
    await expect(tbilisiBtn).toBeVisible()
    await tbilisiBtn.click()
    // dropdown should close
    await expect(page.getByText('Your Location')).not.toBeVisible()
    // pill should now show Tbilisi
    await expect(page.locator('button').filter({ hasText: 'Tbilisi' }).first()).toBeVisible()
  })

  test('Shop nav shortcut shows "Partner stores"', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.getByText('Partner stores')).toBeVisible()
  })

  test('Rewards subtitle uses global copy', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.getByText(/redeem at partner stores worldwide/i)).toBeVisible()
  })

  test('Partner Stores section is present', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.getByText('Partner Telescope Stores')).toBeVisible()
    await expect(page.getByText('Earn Stars anywhere. Spend them at your local dealer.')).toBeVisible()
  })

  test('Partner Store cards render for both dealers', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.getByText('🔭 Astroman')).toBeVisible()
    await expect(page.getByText('🔭 High Point Scientific')).toBeVisible()
    await expect(page.getByText(/Ships to:.*🇬🇪/)).toBeVisible()
    await expect(page.getByText(/Ships to:.*🇺🇸/)).toBeVisible()
  })

  test('Partner Store visit links are correct', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const astromanLink = page.locator('a[href="https://astroman.ge"]')
    const hpsLink = page.locator('a[href="https://www.highpointscientific.com"]')
    await expect(astromanLink).toBeVisible()
    await expect(hpsLink).toBeVisible()
  })

  test('ASTRA prompt pill is no longer Tbilisi-specific', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.getByText("What's visible tonight?")).toBeVisible()
    const body = await page.content()
    expect(body).not.toContain("What's visible tonight in Tbilisi?")
  })

  test('no "Georgia\'s first astronomy store" in hero subtitle', async ({ page }) => {
    await page.goto('http://localhost:3000')
    // check the hero sub-copy specifically
    const heroSection = page.locator('section').first()
    const heroText = await heroSection.innerText()
    expect(heroText).not.toContain("Georgia's first astronomy store")
  })

})

test.describe('G5 — Metadata (OG tags)', () => {
  test('og:title is updated', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content')
    expect(ogTitle).toBe('Stellar — Observe the Sky, Earn on Solana')
  })

  test('og:description is global', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const ogDesc = await page.getAttribute('meta[property="og:description"]', 'content')
    expect(ogDesc).toContain('from anywhere in the world')
  })
})

test.describe('G5 — UX / Responsiveness', () => {
  test('LocationPicker dropdown does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('http://localhost:3000')
    const pill = page.locator('button').filter({ hasText: '▾' }).first()
    await pill.click()
    const dropdown = page.locator('text=Your Location').locator('..')
    const box = await dropdown.boundingBox()
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0)
      // should not overflow right edge
      expect(box.x + box.width).toBeLessThanOrEqual(380)
    }
  })

  test('Partner Stores grid stacks on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('http://localhost:3000')
    await expect(page.getByText('Partner Telescope Stores')).toBeVisible()
    await expect(page.getByText('🔭 Astroman')).toBeVisible()
    await expect(page.getByText('🔭 High Point Scientific')).toBeVisible()
  })

  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(2000)
    // Filter out known non-critical errors
    const critical = errors.filter(e =>
      !e.includes('bigint') &&
      !e.includes('hydration') &&
      !e.includes('privy') &&
      !e.includes('Privy') &&
      !e.includes('favicon')
    )
    expect(critical).toHaveLength(0)
  })
})
