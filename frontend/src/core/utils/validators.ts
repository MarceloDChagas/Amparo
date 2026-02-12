export const isValidCPF = (cpf: string) => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const cpfArr = cpf.split("").map((el) => +el);
  const rest = (count: number) =>
    ((cpfArr
      .slice(0, count - 12)
      .reduce((s, el, i) => s + el * (count - i), 0) *
      10) %
      11) %
    10;
  return rest(10) === cpfArr[9] && rest(11) === cpfArr[10];
};
