import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('redirects / to the default locale', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveURL(/\/vi$/)
  })

  test('renders the homepage sections', async ({ page }) => {
    await page.goto('http://localhost:3000/vi')
    await expect(page.locator('h1').first()).toContainText('IXXMMIVSDRGN')
    for (const id of ['about', 'experience', 'projects', 'education', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })

  test('switches language', async ({ page }) => {
    await page.goto('http://localhost:3000/vi')
    await page.getByRole('button', { name: 'Toggle Language' }).click()
    await expect(page).toHaveURL(/\/en$/)
  })

  test('returns 404 for an unknown locale', async ({ page }) => {
    const res = await page.goto('http://localhost:3000/xx')
    expect(res?.status()).toBe(404)
  })
})
