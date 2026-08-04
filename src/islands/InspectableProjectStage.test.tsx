import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { getProjectInspectionModel } from '../content/project-inspections';
import InspectableProjectStage from './InspectableProjectStage';

const model = getProjectInspectionModel('devdata-generator', 'en');

describe('InspectableProjectStage', () => {
  it('keeps the same Product containers while revealing mapped internals', async () => {
    const user = userEvent.setup();
    const { container } = render(<InspectableProjectStage model={model} />);
    const product = await screen.findByRole('button', { name: 'Product' });
    const system = screen.getByRole('button', { name: 'System' });
    const groupIds = model.productElements.map(({ id }) => id);
    const initialGroups = new Map(
      groupIds.map((id) => [
        id,
        container.querySelector<HTMLElement>(`[data-product-group="${id}"]`),
      ]),
    );

    expect(product).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelectorAll('[data-group-internals]')).toHaveLength(
      0,
    );
    await user.click(system);
    expect(system).toHaveAttribute('aria-pressed', 'true');

    for (const id of groupIds) {
      expect(container.querySelector(`[data-product-group="${id}"]`)).toBe(
        initialGroups.get(id),
      );
    }

    const generate = container.querySelector<HTMLElement>(
      '[data-product-group="generate"]',
    );
    const reuse = container.querySelector<HTMLElement>(
      '[data-product-group="export"]',
    );
    expect(generate).not.toBeNull();
    expect(reuse).not.toBeNull();
    expect(
      within(generate!).getByRole('button', { name: /Validation/ }),
    ).toBeVisible();
    expect(
      within(generate!).getByRole('button', { name: /generateData/ }),
    ).toBeVisible();
    expect(
      within(generate!).getByRole('button', { name: /Faker/ }),
    ).toBeVisible();
    expect(
      within(reuse!).getByRole('button', { name: /Export/ }),
    ).toBeVisible();
    expect(
      within(reuse!).getByRole('button', { name: /Output serializers/ }),
    ).toBeVisible();
    expect(
      within(reuse!).getByRole('button', { name: /Browser APIs/ }),
    ).toBeVisible();
    expect(
      screen.getByText('Select a node to inspect its role and relationships.'),
    ).toBeVisible();
  });

  it('updates local inspection and resets it through Product', async () => {
    const user = userEvent.setup();
    const { container } = render(<InspectableProjectStage model={model} />);
    await user.click(await screen.findByRole('button', { name: 'System' }));
    await user.click(screen.getByRole('button', { name: /generatedData/ }));

    const resultGroup = container.querySelector<HTMLElement>(
      '[data-product-group="result"]',
    );
    const mobileInspector = resultGroup?.querySelector(
      '.inspection-inspector--mobile',
    );
    const desktopInspector = container.querySelector<HTMLElement>(
      '.inspection-inspector--desktop',
    );
    expect(mobileInspector).not.toBeNull();
    expect(resultGroup?.getAttribute('data-contains-selection')).toBe('true');
    expect(
      within(desktopInspector!).getByRole('heading', { name: 'generatedData' }),
    ).toBeVisible();
    expect(
      within(desktopInspector!).getByText(
        /All visible and downloadable outputs/,
      ),
    ).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: /Output serializers/ }),
    );
    expect(
      within(desktopInspector!).getByRole('heading', {
        name: 'Output serializers',
      }),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Product' }));
    expect(container.querySelectorAll('[data-system-node]')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'System' }));
    const resetInspector = container.querySelector<HTMLElement>(
      '.inspection-inspector--desktop',
    );
    expect(
      within(resetInspector!).getByText(
        'Select a node to inspect its role and relationships.',
      ),
    ).toBeVisible();
    expect(
      container.querySelector('[data-system-node][aria-pressed="true"]'),
    ).toBeNull();
  });

  it('follows directional relationships and synchronizes node focus', async () => {
    const user = userEvent.setup();
    const { container } = render(<InspectableProjectStage model={model} />);
    await user.click(await screen.findByRole('button', { name: 'System' }));
    await user.click(screen.getByRole('button', { name: /generatedData/ }));

    const inspector = container.querySelector<HTMLElement>(
      '.inspection-inspector--desktop',
    )!;
    expect(within(inspector).getByText('Produced by')).toBeVisible();
    expect(within(inspector).getByText('Consumed by')).toBeVisible();
    expect(within(inspector).getByText('Invalidated by')).toBeVisible();
    expect(
      within(inspector).getByRole('button', { name: /generateData/ }),
    ).toBeVisible();
    expect(
      within(inspector).getByRole('button', { name: /Preview/ }),
    ).toBeVisible();

    await user.click(within(inspector).getByRole('button', { name: /Export/ }));
    const exportNode = container.querySelector<HTMLButtonElement>(
      '[data-system-node="export"]',
    )!;
    await waitFor(() => expect(exportNode).toHaveFocus());
    expect(exportNode).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(inspector).getByRole('heading', { name: 'Export' }),
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: /generateData/ }));
    expect(within(inspector).getByText('Depends on')).toBeVisible();
    await user.click(within(inspector).getByRole('button', { name: /Faker/ }));
    const fakerNode = container.querySelector<HTMLButtonElement>(
      '[data-system-node="faker"]',
    )!;
    await waitFor(() => expect(fakerNode).toHaveFocus());
    expect(fakerNode).toHaveAttribute('aria-pressed', 'true');
  });

  it('opens and focuses an explicitly requested technical decision', async () => {
    const user = userEvent.setup();
    const { container } = render(<InspectableProjectStage model={model} />);
    await user.click(await screen.findByRole('button', { name: 'System' }));
    await user.click(screen.getByRole('button', { name: /generatedData/ }));
    const inspector = container.querySelector<HTMLElement>(
      '.inspection-inspector--desktop',
    )!;
    await user.click(
      within(inspector).getByRole('button', {
        name: /Why one shared generated result/,
      }),
    );

    const decision = container.querySelector<HTMLDetailsElement>(
      '#single-generated-result',
    )!;
    const summary = decision.querySelector('summary');
    expect(decision.open).toBe(true);
    expect(summary).toHaveFocus();
  });

  it('supports keyboard activation and pressed semantics', async () => {
    const user = userEvent.setup();
    render(<InspectableProjectStage model={model} />);
    const system = await screen.findByRole('button', { name: 'System' });
    system.focus();
    await user.keyboard('{Enter}');
    const generation = screen.getByRole('button', { name: /generateData/ });
    generation.focus();
    await user.keyboard(' ');
    await waitFor(() =>
      expect(generation).toHaveAttribute('aria-pressed', 'true'),
    );
    expect(generation).toHaveFocus();
  });
});
