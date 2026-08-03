import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/en',
  '/es',
  '/en/projects/devdata-generator',
  '/es/projects/devdata-generator',
] as const;

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
}

for (const route of routes) {
  test(`${route} has no automated accessibility violations`, async ({
    page,
  }) => {
    await page.goto(route);
    await expectNoAxeViolations(page);
  });
}

test('enhanced project interaction state has no axe violations', async ({
  page,
}) => {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('button', { name: 'System view' }).click();
  await page
    .getByRole('button', { name: 'Placeholder layer Application' })
    .click();
  await page.locator('#temporary-decision-boundary > summary').click();

  await expectNoAxeViolations(page);
});

test('project content remains usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/en/projects/devdata-generator');

  await expect(page.locator('[data-view-mode-control]')).toBeHidden();
  await expect(
    page.getByRole('region', { name: 'Product view' }),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: 'System view' })).toBeVisible();

  const nodeControls = await page.locator('[data-node-control]').all();
  expect(nodeControls).toHaveLength(3);
  for (const control of nodeControls) {
    await expect(control).toBeHidden();
  }
  await expect(page.locator('.architecture-details')).toBeHidden();

  const explorer = page.locator('[data-architecture-explorer]');
  const staticNodes = [
    {
      id: 'interface',
      label: 'Interface',
      description:
        'Temporary placeholder for an entry point in a generic system.',
    },
    {
      id: 'application',
      label: 'Application',
      description: 'Temporary placeholder for a generic application component.',
    },
    {
      id: 'data',
      label: 'Data',
      description: 'Temporary placeholder for a generic data component.',
    },
  ] as const;

  for (const node of staticNodes) {
    const staticNode = explorer.locator(
      `[data-architecture-node="${node.id}"]`,
    );

    await expect(
      staticNode.getByRole('heading', { level: 4, name: node.label }),
    ).toBeVisible();
    await expect(
      staticNode.getByText(node.description, { exact: true }),
    ).toBeVisible();
  }

  await expect(
    page.getByRole('heading', { level: 4, name: 'Temporary connections' }),
  ).toBeVisible();
  await expect(
    explorer.getByRole('listitem').filter({
      hasText: 'Interface — Temporary structural connection — Application',
    }),
  ).toBeVisible();
  await expect(
    explorer.getByRole('listitem').filter({
      hasText: 'Application — Temporary structural connection — Data',
    }),
  ).toBeVisible();

  const decision = page.locator('#temporary-decision-boundary');
  await decision.locator('summary').click();
  await expect(decision).toHaveAttribute('open', '');
  await expect(
    decision.getByText(
      'This is provisional demonstration content. A verified project decision will replace it after project inspection.',
      { exact: true },
    ),
  ).toBeVisible();

  await context.close();
});
