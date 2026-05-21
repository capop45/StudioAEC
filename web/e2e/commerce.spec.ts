import { test, expect, type APIResponse } from '@playwright/test';

const jsonHeaders = { Accept: 'application/json', 'Content-Type': 'application/json' };

async function expectJsonApiResponse(res: APIResponse, allowedStatuses: number[]) {
  const contentType = res.headers()['content-type'] ?? '';
  expect(contentType).toContain('application/json');
  expect(allowedStatuses).toContain(res.status());
}

test.describe('Commerce — checkout API', () => {
  test('POST /api/checkout valida body', async ({ request }) => {
    const res = await request.post('/api/checkout', {
      headers: jsonHeaders,
      data: {},
    });
    await expectJsonApiResponse(res, [400, 401]);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test('POST /api/checkout rejeita curso inexistente', async ({ request }) => {
    const res = await request.post('/api/checkout', {
      headers: jsonHeaders,
      data: { courseId: 'nonexistent-course-id' },
    });
    await expectJsonApiResponse(res, [404, 503, 401]);
  });

  test('trilha arquitetura lista módulos', async ({ page }) => {
    await page.goto('/treinamentos/arquitetura');
    await expect(page.locator('.course-card').first()).toBeVisible();
    const buyCta = page.getByText(/Comprar/i);
    if ((await buyCta.count()) > 0) {
      await expect(buyCta.first()).toBeVisible();
    }
  });
});
