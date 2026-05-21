import { test, expect } from '@playwright/test';

test.describe('Bibliotecas — download API', () => {
  test('GET download com asset inválido retorna erro JSON', async ({ request }) => {
    const res = await request.get('/api/library/invalid-asset/download', {
      headers: { Accept: 'application/json' },
    });
    const contentType = res.headers()['content-type'] ?? '';
    expect(contentType).toContain('application/json');
    expect([401, 404, 503]).toContain(res.status());
  });

  test('página bibliotecas lista catálogo', async ({ page }) => {
    await page.goto('/bibliotecas');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/produção/i);
    await expect(page.getByText(/Biblioteca Arquitetura/i)).toBeVisible();
    await expect(page.getByText(/Entrar para baixar|Baixar/i).first()).toBeVisible();
  });
});
