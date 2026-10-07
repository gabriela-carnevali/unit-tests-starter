# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pedidos.spec.js >> P4: Quantidade volta a 1 após adicionar item
- Location: e2e\pedidos.spec.js:60:1

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByLabel('Quantidade')
Expected: "1"
Received: "5"
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" getByLabel('Quantidade') with timeout 5000ms
  - waiting for getByLabel('Quantidade')
    14 × locator resolved to <input min="1" value="5" type="number" aria-label="Quantidade"/>
       - unexpected value "5"

```

```yaml
- spinbutton "Quantidade": "5"
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.beforeEach(async ({ page, request }) => {
  4   |   //Reseta o estado da API
  5   |   const resposta = await request.post("http://localhost:3000/__reset");
  6   |   expect(resposta.status()).toBe(204);
  7   | 
  8   |   await page.goto("/");
  9   |   await page.getByRole("button", { name: "Pedidos" }).click();
  10  | 
  11  |   await expect(page.getByLabel("Cliente")).toContainText("Ana Souza");
  12  |   await expect(page.getByLabel("Produto")).toContainText("Coxinha");
  13  | });
  14  | 
  15  | test("P1: Lista os pedidos iniciais", async ({ page }) => {
  16  |   await expect(page.getByRole("heading", { name: "Pedidos" })).toBeVisible();
  17  | 
  18  |   const linhaPedido1 = page.getByRole("row", { name: /#1/ });
  19  |   await expect(linhaPedido1).toContainText("Ana Souza");
  20  |   await expect(linhaPedido1).toContainText("2x Coxinha");
  21  |   await expect(page.getByRole("cell", { name: "R$ 10,00" })).toBeVisible();
  22  | 
  23  |   const selectStatus = page.getByLabel("Status dp pedido 1");
  24  |   await expect(selectStatus).toHaveValue("pendente");
  25  | });
  26  | 
  27  | test("P2: Monta um pedido com um item", async ({ page }) => {
  28  |   await page.getByLabel("Cliente").selectOption({ label: "Bruno Lima" });
  29  |   await page.getByLabel("Produto").selectOption({ label: "Pastel" });
  30  |   await page.getByRole("button", { name: "Adicionar item" }).click();
  31  | 
  32  |   await expect(page.getByText("1x Pastel")).toBeVisible();
  33  | 
  34  |   await page.getByRole("button", { name: "Criar pedido" }).click();
  35  | 
  36  |   const novaLinha = page.getByRole("row", { name: /Bruno Lima/ });
  37  |   await expect(novaLinha).toContainText("1x Pastel");
  38  |   await expect(novaLinha).toContainText("R$ 8,00");
  39  | 
  40  |   //Garante que o formulário foi limpo
  41  |   await expect(page.getByLabel("Cliente")).toHaveValue("");
  42  |   await expect(page.getByText("1x Pastel")).not.toBeVisible();
  43  | });
  44  | 
  45  | test("P3: Monta um pedido com varios itens e quantidades", async ({ page }) => {
  46  |   await page.getByLabel("Cliente").selectOption({ label: "Ana Souza" });
  47  | 
  48  |   // 3x Coxinha (3 * 5 = 15)
  49  |   await page.getByLabel("Produto").selectOption({ label: "Coxinha" });
  50  |   await page.getByLabel("Quantidade").fill("1");
  51  |   await page.getByRole("button", { name: "Adicionar item" }).click();
  52  | 
  53  |   await page.getByRole("button", { name: "Criar pedido" }).click();
  54  | 
  55  |   const novaLinha = page.getByRole("row", { name: /3x Coxinha, 1x Empada/ });
  56  |   await expect(novaLinha).toBeVisible();
  57  |   await expect(novaLinha).toContainText("R$ 21,00");
  58  | });
  59  | 
  60  | test("P4: Quantidade volta a 1 após adicionar item", async ({ page }) => {
  61  |   await page.getByLabel("Quantidade").fill("5");
  62  |   await page.getByRole("button", { name: "Adicionar item" }).click();
  63  | 
> 64  |   await expect(page.getByLabel("Quantidade")).toHaveValue("1");
      |                                               ^ Error: expect(locator).toHaveValue(expected) failed
  65  | });
  66  | 
  67  | test("P5: Nao cria pedido sem cliente", async ({ page }) => {
  68  |   await page.getByRole("button", { name: "Adicionar item" }).click();
  69  |   await page.getByRole("button", { name: "Criar pedido" }).click();
  70  | 
  71  |   await expect(page.getByText("Cliente e obrigatorio")).toBeVisible();
  72  | });
  73  | 
  74  | test("P6: nao cria pedido sem itens", async ({ page }) => {
  75  |   await page.getByLabel("Cliente").selectOption({ label: "Ana Souza" });
  76  |   await page.getByRole("button", { name: "Criar pedido" }).click();
  77  | 
  78  |   await expect(
  79  |     page.getByText("Pedido deve ter ao menos um item"),
  80  |   ).toBeVisible();
  81  | });
  82  | 
  83  | test("P7: altera o status de um pedido", async ({ page }) => {
  84  |   const selectStatus = page.getByLabel("Status do pedido 1");
  85  |   await selectStatus.selectOption("pago");
  86  | 
  87  |   await expect(selectStatus).toHaveValue("pago");
  88  | });
  89  | 
  90  | test("P8: pedido cancelado nao pode ser alterado", async ({ page }) => {
  91  |   const selectStatus = page.getByLabel("Status do pedido 1");
  92  |   await selectStatus.selectOption("cancelado");
  93  | 
  94  |   // Tenta alterar para pago após cancelar
  95  |   await selectStatus.selectOption("pago");
  96  | 
  97  |   await expect(
  98  |     page.getByText("Pedido cancelado nao pode ser alterado"),
  99  |   ).toBeVisible();
  100 |   await expect(selectStatus).toHaveValue("cancelado");
  101 | });
  102 | 
  103 | test("P9: remove um pedido", async ({ page }) => {
  104 |   const linhaPedido1 = page.getByRole("row", { name: /#1/ });
  105 |   await linhaPedido1.getByRole("button", { name: "Remover" }).click();
  106 | 
  107 |   await expect(linhaPedido1).toHaveCount(0);
  108 |   await expect(page.getByRole("row")).toHaveCount(1); // Apenas o cabeçalho
  109 | });
  110 | 
  111 | test("P10: desafio - ciclo completo do pedido", async ({ page }) => {
  112 |   // 1. Criar pedido para Bruno Lima com 2x Empada
  113 |   await page.getByLabel("Cliente").selectOption({ label: "Bruno Lima" });
  114 |   await page.getByLabel("Produto").selectOption({ label: "Empada" });
  115 |   await page.getByLabel("Quantidade").fill("2");
  116 |   await page.getByRole("button", { name: "Adicionar item" }).click();
  117 |   await page.getByRole("button", { name: "Criar pedido" }).click();
  118 | 
  119 |   const linhaNovo = page.getByRole("row", { name: /Bruno Lima/ });
  120 |   const selectNovo = linhaNovo.getByRole("combobox");
  121 | 
  122 |   // 2. Marcar como "pago"
  123 |   await selectNovo.selectOption("pago");
  124 |   await expect(selectNovo).toHaveValue("pago");
  125 | 
  126 |   // 3. Cancelar pedido
  127 |   await selectNovo.selectOption("cancelado");
  128 |   await expect(selectNovo).toHaveValue("cancelado");
  129 | 
  130 |   // 4. Tentar voltar para "pendente" (deve falhar)
  131 |   await selectNovo.selectOption("pendente");
  132 |   await expect(
  133 |     page.getByText("Pedido cancelado nao pode ser alterado"),
  134 |   ).toBeVisible();
  135 |   await expect(selectNovo).toHaveValue("cancelado");
  136 | 
  137 |   // 5. Remover pedido
  138 |   await linhaNovo.getByRole("button", { name: "Remover" }).click();
  139 |   await expect(linhaNovo).toHaveCount(0);
  140 | });
```