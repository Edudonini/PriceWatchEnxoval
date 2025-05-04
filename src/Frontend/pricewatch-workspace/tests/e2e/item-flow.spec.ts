// tests/e2e/item-flow.spec.ts
import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Fluxo completo de Item', () => {

  // helper: gera um objeto de entrada
  const makeItem = () => ({
    name:       'Playwright‑' + randomUUID().slice(0, 8),
    category:   1,          // Electronics
    currency:   'BRL',
  });

  test('cria, lista e exclui', async ({ page, baseURL }) => {
    // 1️⃣  Abre a aplicação
    await page.goto(baseURL!);

    /* ---------------- Criar ---------------- */
    await page.getByRole('button', { name: 'NOVO ITEM' }).click();

    const item = makeItem();
    await page.getByLabel('Nome').fill(item.name);
    await page.getByLabel('Categoria').click();
    await page.getByRole('option', { name: 'Electronics' }).click();
    await page.getByLabel('Moeda').fill(item.currency);
    await page.getByRole('button', { name: 'Salvar' }).click();

    // espera snackbar
    await expect(page.getByText('Item criado')).toBeVisible();

    /* ---------------- Listagem ---------------- */
    const row = page.getByRole('row', { name: new RegExp(item.name, 'i') });
    await expect(row).toBeVisible();

    /* ---------------- Delete ---------------- */
    await row.getByRole('button', { name: /delete/i }).click();
    // confirma o alerta
    await page.on('dialog', d => d.accept());

    // a linha deve sumir
    await expect(row).toHaveCount(0);
  });
});
