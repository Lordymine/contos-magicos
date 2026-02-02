import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/')

    // Updated to match the new H1 in src/app/page.tsx
    await expect(page.locator('h1')).toContainText('Crie histórias')
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByRole('link', { name: /contos mágicos/i })).toBeVisible()
    
    // "Nova História" in nav is now hidden for guests. 
    // We check for the main CTA "Criar História Mágica" in the hero section instead for guests.
    await expect(page.getByRole('link', { name: /criar história mágica/i }).first()).toBeVisible()
  })

  test('should show login button for unauthenticated users', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('link', { name: /entrar/i }).first()).toBeVisible()
  })
})

test.describe('Story Creation', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/stories/create')

    await expect(page).toHaveURL(/\/auth\/login/)
  })
})

test.describe('Login Page', () => {
  test('should display login options', async ({ page }) => {
    await page.goto('/auth/login')

    // Updated title
    await expect(page.getByText('Bem-vindo de volta!')).toBeVisible()
    // Only Google is currently implemented
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
  })
})
