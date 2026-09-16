function soma(a, b) {
  return a + b;
}

function subtrai(a, b) {
  return a - b;
}

function multiplica(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Nao e possivel dividir por zero");
  return a / b;
}

function ehPar(numero) {
  return numero % 2 === 0;
}

function raiz(numero) {
  if (numero < 0) {
    throw new Error("Nao e possivel calcular raiz de numero negativo");
  }

  return Math.sqrt(numero);
}

function media(numeros) {
  if (!Array.isArray(numeros)) {
    throw new Error("O argumento precisa ser uma lista de números");
  }

  if (numeros.length === 0) {
    throw new Error("A lista de numeros nao pode ser vazia");
  }

  return numeros.reduce((soma, numero) => soma + numero, 0) / numeros.length;
}

module.exports = {
  soma,
  subtrai,
  multiplica,
  divide,
  ehPar,
  raiz,
  media,
};
