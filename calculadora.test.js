const {
  soma,
  subtrai,
  multiplica,
  divide,
  ehPar,
  raiz,
  media,
} = require("./calculadora");

describe("soma", () => {
  test("Soma com dois números positivos", () => {
    expect(soma(2, 3)).toBe(5);
  });
});

describe("subtrai", () => {
  test("Subtração com dois números positivos", () => {
    expect(subtrai(5, 3)).toBe(2);
  });
  test("Subtração de número maior para dar valor negativo", () => {
    expect(subtrai(3, 5)).toBe(-2);
  });
});

describe("multiplica", () => {
  test("Retorno do produto correto de dois numeros", () => {
    expect(multiplica(5, 5)).toBe(25);
  });
  test("Retornar 0 quando um dos valores for zero", () => {
    expect(multiplica(5, 0)).toBe(0);
  });
  test("Resultado maior que cada um dos fatores (quando for maior que 1)", () => {
    expect(multiplica(5, 5)).toBeGreaterThan(5);
  });
});

describe("divide", () => {
  test("Retornar o produto correto de dois números positivos", () => {
    expect(divide(10, 2)).toBe(5);
  });
  test("Erro ao dividir por 0", () => {
    expect(() => divide(5, 0)).toThrow("Nao e possivel dividir por zero");
  });
});

describe("ehPar", () => {
  test("Retornar um valor verdadeiro para número par", () => {
    expect(ehPar(2)).toBe(true);
  });
  test("Retornar um valor falso para número ímpar", () => {
    expect(ehPar(1)).toBe(false);
  });
});

describe("raiz", () => {
  test("Raiz de um número inteiro", () => {
    expect(raiz(9)).toBe(3);
  });
  test("Raiz de um número não exato com precisão", () => {
    expect(raiz(2)).toBeCloseTo(1.414);
  });
  test("Lançar erro para número negativo", () => {
    expect(() => raiz(-4)).toThrow(
      "Nao e possivel calcular raiz de numero negativo",
    );
  });
});

describe("media", () => {
  test("Calcular corretamente a média de uma lista de números", () => {
    expect(media([5, 5, 5])).toBe(5);
  });
  test("Calcular corretamente a média quando o resultado for decimal", () => {
    expect(media([5, 7, 10])).toBeCloseTo(7.333, 2);
  });
  test("Lançar erro se a lista estiver vazia", () => {
    expect(() => media([])).toThrow("A lista de numeros nao pode ser vazia");
  });
  test("Lançar erro se o argumento não for array", () => {
    expect(() => media(5, 2, 1)).toThrow(
      "O argumento precisa ser uma lista de números",
    );
  });
});
