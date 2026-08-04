import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
});

test('opens the same project flow and resets inspection on Product', async ({
  page,
}) => {
  const product = page.getByRole('button', { name: 'Product', exact: true });
  const system = page.getByRole('button', { name: 'System', exact: true });
  const groups = page.locator('[data-product-group]');

  await expect(product).toHaveAttribute('aria-pressed', 'true');
  const productVisual = page.locator(
    '[data-inspection-enhanced] [data-product-visual] img',
  );
  await expect(productVisual).toBeVisible();
  await expect(productVisual).toHaveAttribute(
    'src',
    '/images/projects/devdata/devdata-product-overview.png',
  );
  await expect(productVisual).toHaveAttribute('alt', /Users template/);
  await expect(
    page.locator('[data-inspection-enhanced] [data-product-visual] source'),
  ).toHaveAttribute(
    'srcset',
    '/images/projects/devdata/devdata-product-overview.jpg',
  );
  await expect(groups).toHaveCount(5);
  await expect(page.locator('[data-product-group="result"]')).toHaveAttribute(
    'data-focal',
    'true',
  );
  await expect(
    page.getByRole('heading', { name: 'How the product works' }),
  ).toBeVisible();
  const inspectSystem = page.getByRole('button', { name: 'Inspect system' });
  await expect(inspectSystem).toBeVisible();
  await inspectSystem.click();
  await expect(groups).toHaveCount(5);
  await expect(
    page.locator('[data-product-group="generate"] [data-system-node]'),
  ).toHaveCount(3);
  await expect(
    page.locator('[data-product-group="export"] [data-system-node]'),
  ).toHaveCount(3);
  await expect(system).toHaveAttribute('aria-pressed', 'true');
  const branchEndpointsAlign = await page.evaluate(() => {
    const endpointX = (connectionId: string) => {
      const path = document.querySelector<SVGPathElement>(
        `.causal-connector__desktop[data-connection-id="${connectionId}"]`,
      );
      if (!path) return undefined;
      const matrix = path.getScreenCTM();
      if (!matrix) return undefined;
      const point = path.getPointAtLength(path.getTotalLength());
      return point.matrixTransform(matrix).x;
    };
    const containsX = (selector: string, x: number | undefined) => {
      const rect = document.querySelector(selector)?.getBoundingClientRect();
      return (
        x !== undefined &&
        rect !== undefined &&
        x >= rect.left &&
        x <= rect.right
      );
    };

    return {
      preview: containsX(
        '[data-product-group="preview"]',
        endpointX('result-preview'),
      ),
      reuse: containsX(
        '[data-product-group="export"]',
        endpointX('result-export'),
      ),
    };
  });
  expect(branchEndpointsAlign).toEqual({ preview: true, reuse: true });
  const enhanced = page.locator('[data-inspection-enhanced]');
  await expect(enhanced.locator('[data-evidence-artifact]')).toHaveCount(3);
  await expect(enhanced.getByText('src/utils/generateData.js')).toBeVisible();
  await expect(enhanced.getByText('src/App.jsx')).toBeVisible();
  const sourceEvidence = enhanced.locator(
    '[data-evidence-artifact="generation-boundary"]',
  );
  await expect(sourceEvidence).not.toHaveAttribute('open', '');
  await sourceEvidence.locator('summary').click();
  await expect(sourceEvidence).toHaveAttribute('open', '');
  await expect(sourceEvidence.getByText(/fakerES as faker/)).toBeVisible();
  const invalidationEvidence = enhanced.locator(
    '[data-evidence-artifact="configuration-invalidation"]',
  );
  await invalidationEvidence.locator('summary').click();
  await expect(invalidationEvidence).toHaveAttribute('open', '');
  for (const artifact of [sourceEvidence, invalidationEvidence]) {
    expect(
      await artifact.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  }
  const outputEvidence = enhanced.locator(
    '[data-evidence-artifact="multiple-output-representations"]',
  );
  await expect(
    outputEvidence.getByRole('heading', { name: 'JSON' }),
  ).toBeVisible();
  await expect(page.locator('[data-product-group="result"]')).toHaveAttribute(
    'data-contains-connected',
    'false',
  );
  await expect(
    outputEvidence.getByRole('heading', { name: 'CSV' }),
  ).toBeVisible();
  await expect(
    outputEvidence.getByRole('heading', { name: 'SQL' }),
  ).toBeVisible();
  await expect(
    outputEvidence.getByText('Illustrative data, not a recorded execution'),
  ).toBeVisible();
  await expect(
    page.getByText('Select a node to inspect its role and relationships.'),
  ).toBeVisible();

  await page.getByRole('button', { name: /generatedData/ }).click();
  await expect(
    page.locator('[data-causal-connector="generate"]'),
  ).toHaveAttribute('data-connection-state', 'active');
  await expect(
    page.locator('[data-causal-connector="result"]'),
  ).toHaveAttribute('data-connection-state', 'active');
  await expect(page.locator('[data-product-group="generate"]')).toHaveAttribute(
    'data-active-outgoing',
    'true',
  );
  await expect(page.locator('[data-product-group="preview"]')).toHaveAttribute(
    'data-contains-connected',
    'true',
  );
  await expect(page.locator('[data-product-group="export"]')).toHaveAttribute(
    'data-contains-connected',
    'true',
  );
  await expect(
    page.locator(
      '.inspection-inspector--desktop [data-inspector-node="generated-data"]',
    ),
  ).toContainText(
    'All visible and downloadable outputs represent the same generation.',
  );
  await product.click();
  await system.click();
  await expect(
    page.getByText('Select a node to inspect its role and relationships.'),
  ).toBeVisible();
});

test('perspective and node controls support keyboard activation', async ({
  page,
}) => {
  const system = page.getByRole('button', { name: 'System', exact: true });
  await system.focus();
  await page.keyboard.press('Enter');
  const result = page.getByRole('button', { name: /generatedData/ });
  await result.focus();
  await page.keyboard.press('Space');
  await expect(result).toHaveAttribute('aria-pressed', 'true');
  await expect(result).toBeFocused();
});

test('remains usable at a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'System', exact: true }).click();
  await expect(page.locator('[data-causal-connector="preview"]')).toHaveCount(
    0,
  );
  await expect(
    page.locator(
      '[data-causal-connector="result"] .causal-connector__mobile[data-connection-id="result-preview"]',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator(
      '[data-causal-connector="result"] .causal-connector__mobile[data-connection-id="result-export"]',
    ),
  ).toHaveCount(1);
  await page.getByRole('button', { name: /generatedData/ }).click();
  await expect(
    page.locator(
      '[data-product-group="result"] .inspection-inspector--mobile [data-inspector-node="generated-data"]',
    ),
  ).toBeVisible();
  await expect(page.locator('[data-product-group="result"]')).toHaveAttribute(
    'data-contains-selection',
    'true',
  );
  const resultGroup = page.locator('[data-product-group="result"]');
  const inspectorBeforeEvidence = await resultGroup.evaluate((group) => {
    const inspector = group.querySelector('.inspection-inspector--mobile');
    const evidence = group.querySelector('.group-evidence');
    return Boolean(
      inspector &&
      evidence &&
      inspector.compareDocumentPosition(evidence) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
  expect(inspectorBeforeEvidence).toBe(true);
  await page
    .locator('[data-product-group="result"] .inspection-inspector--mobile')
    .getByRole('button', { name: /Export/ })
    .click();
  await expect(page.locator('[data-system-node="export"]')).toBeFocused();
  await expect(page.locator('[data-product-group="export"]')).toHaveAttribute(
    'data-contains-selection',
    'true',
  );
  await expect(
    page.locator(
      '[data-product-group="export"] .inspection-inspector--mobile [data-inspector-node="export"]',
    ),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
