import { MaskingUtils } from "@/shared/utils/masking.utils";

describe("MaskingUtils", () => {
  it("masks valid CPF values and keeps invalid values unchanged", () => {
    expect(MaskingUtils.maskCPF("12345678901")).toBe("123.***.***-01");
    expect(MaskingUtils.maskCPF("invalid")).toBe("invalid");
    expect(MaskingUtils.maskCPF("")).toBe("");
  });

  it("masks mobile and landline phones", () => {
    expect(MaskingUtils.maskPhone("11987654321")).toBe("(11) *****-4321");
    expect(MaskingUtils.maskPhone("1134567890")).toBe("(11) ****-7890");
    expect(MaskingUtils.maskPhone("123")).toBe("123");
  });

  it("masks email users and keeps invalid emails unchanged", () => {
    expect(MaskingUtils.maskEmail("maria@example.com")).toBe(
      "mar***@example.com",
    );
    expect(MaskingUtils.maskEmail("ana@example.com")).toBe("ana***@example.com");
    expect(MaskingUtils.maskEmail("invalid")).toBe("invalid");
    expect(MaskingUtils.maskEmail("")).toBe("");
  });
});
