import { test, expect } from '@playwright/test';

test.describe('Estúdio AEC — smoke público', () => {
  test('home carrega com hero e trilhas', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Estúdio AEC/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/obra/i);
    await expect(page.getByRole('link', { name: /Explorar trilhas/i })).toBeVisible();
  });

  test('API de trilhas retorna 6 disciplinas', async ({ request }) => {
    const res = await request.get('/api/tracks');
    expect(res.ok()).toBeTruthy();
    const tracks = await res.json();
    expect(Array.isArray(tracks)).toBeTruthy();
    expect(tracks.length).toBeGreaterThanOrEqual(6);
  });

  test('catálogo de treinamentos', async ({ page }) => {
    await page.goto('/treinamentos');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('health endpoint', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe('healthy');
  });

  test('sign-in page renderiza em PT-BR', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('.auth-page--clerk')).toBeVisible();
    await expect(page.getByText(/Entrar na área do aluno/i)).toBeVisible();
    await expect(page.getByText(/Clerk/i)).toHaveCount(0);
  });

  test('sign-up page renderiza em PT-BR', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.locator('.auth-page--clerk')).toBeVisible();
    await expect(page.getByText(/Criar sua conta/i)).toBeVisible();
    await expect(page.getByText(/Clerk/i)).toHaveCount(0);
  });
});
