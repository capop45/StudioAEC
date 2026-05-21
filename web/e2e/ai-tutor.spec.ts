import { test, expect, type APIResponse } from '@playwright/test';

const jsonHeaders = { Accept: 'application/json', 'Content-Type': 'application/json' };

async function expectJsonApiResponse(res: APIResponse, allowedStatuses: number[]) {
  const contentType = res.headers()['content-type'] ?? '';
  expect(contentType).toContain('application/json');
  expect(allowedStatuses).toContain(res.status());
}

test.describe('AI Tutor — API', () => {
  test('POST /api/ai/tutor valida body', async ({ request }) => {
    const res = await request.post('/api/ai/tutor', {
      headers: jsonHeaders,
      data: { courseId: 'x' },
    });
    await expectJsonApiResponse(res, [400, 401]);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test('POST /api/ai/tutor rejeita curso sem matrícula ou inexistente', async ({ request }) => {
    const res = await request.post('/api/ai/tutor', {
      headers: jsonHeaders,
      data: { courseId: 'nonexistent-course-id', message: 'Como configurar template?' },
    });
    await expectJsonApiResponse(res, [403, 404, 503, 401]);
  });
});
