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
    test.setTimeout(60000); // aumenta o timeout para 60 segundos

    // 1️⃣  Abre a aplicação
    await page.goto(baseURL!);
    console.log('Página carregada');

    /* ---------------- Criar ---------------- */
    await page.getByRole('button', { name: 'NOVO ITEM' }).click();
    console.log('Clicou em NOVO ITEM');

    const item = makeItem();
    console.log('Item a ser criado:', item);
    
    await page.getByLabel('Nome').fill(item.name);
    await page.getByLabel('Categoria').click();
    await page.getByRole('option', { name: 'Electronics' }).click();
    await page.getByLabel('Moeda').fill(item.currency);
    await page.getByRole('button', { name: 'Salvar' }).click();
    console.log('Formulário preenchido e salvo');

    // espera snackbar
    await expect(page.getByText('Item criado')).toBeVisible();
    console.log('Snackbar de sucesso visível');

    /* ---------------- Listagem ---------------- */
    const row = page.getByRole('row', { name: new RegExp(item.name, 'i') });
    await expect(row).toBeVisible();
    console.log('Linha do item encontrada na tabela');

    // Verifica se o botão de deletar existe
    const deleteButton = row.getByRole('button', { name: /delete/i }).or(
      row.getByRole('button').filter({ has: page.getByTestId('delete-icon') })
    );
    await expect(deleteButton).toBeVisible();
    console.log('Botão de deletar encontrado');

    /* ---------------- Delete ---------------- */
    // registra o handler do confirm antes de clicar
    page.on('dialog', dialog => {
      console.log('Dialog apareceu:', dialog.message());
      dialog.accept();
    });
    console.log('Handler do confirm registrado');
    
    // Aguarda o botão estar realmente pronto para interação
    await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Botão de deletar visível e pronto');
    
    // Tenta clicar com retry
    await deleteButton.click({ timeout: 10000, force: true });
    console.log('Clicou no botão de deletar');

    // espera snackbar
    await expect(page.getByText('Excluído')).toBeVisible();
    console.log('Snackbar de exclusão visível');

    // a linha deve sumir
    await expect(row).toHaveCount(0);
    console.log('Linha removida da tabela');
  });
});
