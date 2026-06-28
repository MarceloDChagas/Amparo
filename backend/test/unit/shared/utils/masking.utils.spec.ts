import { MaskingUtils } from "@/shared/utils/masking.utils";

// Valida as funções de mascaramento de dados sensíveis (CPF, telefone e e-mail).
describe("MaskingUtils", () => {
  // Garante que CPF válido é mascarado e valores inválidos/vazios ficam intactos.
  it("masks valid CPF values and keeps invalid values unchanged", () => {
    expect(MaskingUtils.maskCPF("12345678901")).toBe("123.***.***-01");
    expect(MaskingUtils.maskCPF("invalid")).toBe("invalid");
    expect(MaskingUtils.maskCPF("")).toBe("");
  });

  // Garante o mascaramento de celular e fixo, mantendo intacto o que não for telefone.
  it("masks mobile and landline phones", () => {
    expect(MaskingUtils.maskPhone("11987654321")).toBe("(11) *****-4321");
    expect(MaskingUtils.maskPhone("1134567890")).toBe("(11) ****-7890");
    expect(MaskingUtils.maskPhone("123")).toBe("123");
  });

  // Garante o mascaramento do usuário do e-mail e valores inválidos/vazios intactos.
  it("masks email users and keeps invalid emails unchanged", () => {
    expect(MaskingUtils.maskEmail("maria@example.com")).toBe(
      "mar***@example.com",
    );
    expect(MaskingUtils.maskEmail("ana@example.com")).toBe(
      "ana***@example.com",
    );
    expect(MaskingUtils.maskEmail("invalid")).toBe("invalid");
    expect(MaskingUtils.maskEmail("")).toBe("");
  });
});
