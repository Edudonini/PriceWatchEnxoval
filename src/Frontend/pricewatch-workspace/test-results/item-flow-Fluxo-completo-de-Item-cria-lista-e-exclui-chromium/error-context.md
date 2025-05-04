# Test info

- Name: Fluxo completo de Item >> cria, lista e exclui
- Location: C:\Workspace\Portfolio\PriceWatchEnxoval\src\Frontend\pricewatch-workspace\tests\e2e\item-flow.spec.ts:14:7

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('row', { name: /Playwright‑ea1f99e4/i }).getByRole('button', { name: /delete/i })

    at C:\Workspace\Portfolio\PriceWatchEnxoval\src\Frontend\pricewatch-workspace\tests\e2e\item-flow.spec.ts:36:56
```

# Page snapshot

```yaml
- heading "Itens monitorados" [level=2]
- button "NOVO ITEM"
- table:
  - rowgroup:
    - row "Nome Cat. Histórico Ações":
      - columnheader "Nome"
      - columnheader "Cat."
      - columnheader "Histórico"
      - columnheader "Ações"
  - rowgroup:
    - row "BATATA 0":
      - cell "BATATA"
      - cell "0"
      - cell:
        - link "Ver gráfico":
          - /url: /items/55049279-9712-4c91-9c4c-4bba6f4bfac6/history
      - cell:
        - button
        - button
    - row "TESTE 4 0":
      - cell "TESTE 4"
      - cell "0"
      - cell:
        - link "Ver gráfico":
          - /url: /items/f2b97ae4-7f1b-4d71-95fb-c238b9f282ba/history
      - cell:
        - button
        - button
    - row "TESTE 2 0":
      - cell "TESTE 2"
      - cell "0"
      - cell:
        - link "Ver gráfico":
          - /url: /items/3c2667a4-6298-45a2-aae9-f5ec00e1c281/history
      - cell:
        - button
        - button
    - row "PLAYWRIGHT‑EA1F99E4 1":
      - cell "PLAYWRIGHT‑EA1F99E4"
      - cell "1"
      - cell:
        - link "Ver gráfico":
          - /url: /items/0c15b758-107f-49ef-8210-745310f607b2/history
      - cell:
        - button
        - button
```

# Test source

```ts
   1 | // tests/e2e/item-flow.spec.ts
   2 | import { test, expect } from '@playwright/test';
   3 | import { randomUUID } from 'crypto';
   4 |
   5 | test.describe('Fluxo completo de Item', () => {
   6 |
   7 |   // helper: gera um objeto de entrada
   8 |   const makeItem = () => ({
   9 |     name:       'Playwright‑' + randomUUID().slice(0, 8),
  10 |     category:   1,          // Electronics
  11 |     currency:   'BRL',
  12 |   });
  13 |
  14 |   test('cria, lista e exclui', async ({ page, baseURL }) => {
  15 |     // 1️⃣  Abre a aplicação
  16 |     await page.goto(baseURL!);
  17 |
  18 |     /* ---------------- Criar ---------------- */
  19 |     await page.getByRole('button', { name: 'NOVO ITEM' }).click();
  20 |
  21 |     const item = makeItem();
  22 |     await page.getByLabel('Nome').fill(item.name);
  23 |     await page.getByLabel('Categoria').click();
  24 |     await page.getByRole('option', { name: 'Electronics' }).click();
  25 |     await page.getByLabel('Moeda').fill(item.currency);
  26 |     await page.getByRole('button', { name: 'Salvar' }).click();
  27 |
  28 |     // espera snackbar
  29 |     await expect(page.getByText('Item criado')).toBeVisible();
  30 |
  31 |     /* ---------------- Listagem ---------------- */
  32 |     const row = page.getByRole('row', { name: new RegExp(item.name, 'i') });
  33 |     await expect(row).toBeVisible();
  34 |
  35 |     /* ---------------- Delete ---------------- */
> 36 |     await row.getByRole('button', { name: /delete/i }).click();
     |                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  37 |     // confirma o alerta
  38 |     await page.on('dialog', d => d.accept());
  39 |
  40 |     // a linha deve sumir
  41 |     await expect(row).toHaveCount(0);
  42 |   });
  43 | });
  44 |
```