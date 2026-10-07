import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, request }) => {
  //Reseta o estado da API
  const resposta = await request.post("http://localhost:3000/__reset");
  expect(resposta.status()).toBe(204);

  await page.goto("/");
  await page.getByRole("button", { name: "Pedidos" }).click();

  await expect(page.getByLabel("Cliente")).toContainText("Ana Souza");
  await expect(page.getByLabel("Produto")).toContainText("Coxinha");
});

test("P1: Lista os pedidos iniciais", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Pedidos" })).toBeVisible();

  const linhaPedido1 = page
    .getByRole("row")
    .filter({ has: page.getByRole("cell", { name: "1", exact: true }) });
  await expect(linhaPedido1).toContainText("Ana Souza");
  await expect(linhaPedido1).toContainText("2x Coxinha");
  await expect(page.getByRole("cell", { name: "R$ 10,00" })).toBeVisible();

  const selectStatus = page.getByLabel("Status do pedido 1");
  await expect(selectStatus).toHaveValue("pendente");
});

test("P2: Monta um pedido com um item", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption({ label: "Bruno Lima" });
  await page.getByLabel("Produto").selectOption({ label: "Pastel" });
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await expect(page.getByText("1x Pastel")).toBeVisible();

  await page.getByRole("button", { name: "Criar pedido" }).click();

  const novaLinha = page.getByRole("row", { name: /Bruno Lima/ });
  await expect(novaLinha).toContainText("1x Pastel");
  await expect(novaLinha).toContainText("R$ 8,00");

  //Garante que o formulário foi limpo
  await expect(page.getByLabel("Cliente")).toHaveValue("");
  await expect(page.locator("ul")).toHaveCount(0);
});

test("P3: Monta um pedido com varios itens e quantidades", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption({ label: "Ana Souza" });

  // 3x Coxinha (3 * 5 = 15)
  await page.getByLabel("Produto").selectOption({ label: "Coxinha" });
  await page.getByLabel("Quantidade").fill("3");
  await page.getByRole("button", { name: "Adicionar item" }).click();

  // 1x Empada (1 * 6 = 6)
  await page.getByLabel("Produto").selectOption({ label: "Empada" });
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await page.getByRole("button", { name: "Criar pedido" }).click();

  const novaLinha = page.getByRole("row", { name: /3x Coxinha, 1x Empada/ });
  await expect(novaLinha).toBeVisible();
  await expect(novaLinha).toContainText("R$ 21,00");
});

test("P4: Quantidade volta a 1 após adicionar item", async ({ page }) => {
  await page.getByLabel("Quantidade").fill("5");
  await page.getByRole("button", { name: "Adicionar item" }).click();

  await expect(page.getByLabel("Quantidade")).toHaveValue("1");
});

test("P5: Nao cria pedido sem cliente", async ({ page }) => {
  await page.getByRole("button", { name: "Adicionar item" }).click();
  await page.getByRole("button", { name: "Criar pedido" }).click();

  await expect(page.getByText("Cliente e obrigatorio")).toBeVisible();
});

test("P6: nao cria pedido sem itens", async ({ page }) => {
  await page.getByLabel("Cliente").selectOption({ label: "Ana Souza" });
  await page.getByRole("button", { name: "Criar pedido" }).click();

  await expect(
    page.getByText("Pedido deve ter ao menos um item"),
  ).toBeVisible();
});

test("P7: altera o status de um pedido", async ({ page }) => {
  const selectStatus = page.getByLabel("Status do pedido 1");
  await selectStatus.selectOption("pago");

  await expect(selectStatus).toHaveValue("pago");
});

test("P8: pedido cancelado nao pode ser alterado", async ({ page }) => {
  const selectStatus = page.getByLabel("Status do pedido 1");
  await selectStatus.selectOption("cancelado");

  // Tenta alterar para pago após cancelar
  await selectStatus.selectOption("pago");

  await expect(
    page.getByText("Pedido cancelado nao pode ser alterado"),
  ).toBeVisible();
  await expect(selectStatus).toHaveValue("cancelado");
});

test("P9: remove um pedido", async ({ page }) => {
  const linhaPedido1 = page
    .getByRole("row")
    .filter({ has: page.getByRole("cell", { name: "1", exact: true }) });
  await linhaPedido1.getByRole("button", { name: "Remover" }).click();

  await expect(linhaPedido1).toHaveCount(0);
  await expect(page.getByRole("row")).toHaveCount(1); // Apenas o cabeçalho
});

test("P10: desafio - ciclo completo do pedido", async ({ page }) => {
  // 1. Criar pedido para Bruno Lima com 2x Empada
  await page.getByLabel("Cliente").selectOption({ label: "Bruno Lima" });
  await page.getByLabel("Produto").selectOption({ label: "Empada" });
  await page.getByLabel("Quantidade").fill("2");
  await page.getByRole("button", { name: "Adicionar item" }).click();
  await page.getByRole("button", { name: "Criar pedido" }).click();

  const linhaNovo = page.getByRole("row", { name: /Bruno Lima/ });
  const selectNovo = linhaNovo.getByRole("combobox");

  // 2. Marcar como "pago"
  await selectNovo.selectOption("pago");
  await expect(selectNovo).toHaveValue("pago");

  // 3. Cancelar pedido
  await selectNovo.selectOption("cancelado");
  await expect(selectNovo).toHaveValue("cancelado");

  // 4. Tentar voltar para "pendente" (deve falhar)
  await selectNovo.selectOption("pendente");
  await expect(
    page.getByText("Pedido cancelado nao pode ser alterado"),
  ).toBeVisible();
  await expect(selectNovo).toHaveValue("cancelado");

  // 5. Remover pedido
  await linhaNovo.getByRole("button", { name: "Remover" }).click();
  await expect(linhaNovo).toHaveCount(0);
});