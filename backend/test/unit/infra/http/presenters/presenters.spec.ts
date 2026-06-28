import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import { EmergencyContact } from "@/core/domain/entities/emergency-contact.entity";
import { User } from "@/core/domain/entities/user.entity";
import { AggressorPresenter } from "@/infra/http/presenters/aggressor.presenter";
import { EmergencyContactPresenter } from "@/infra/http/presenters/emergency-contact.presenter";
import { UserPresenter } from "@/infra/http/presenters/user.presenter";

// Valida que os presenters HTTP mascaram dados sensíveis e omitem campos privados.
describe("HTTP presenters", () => {
  // Garante que o CPF do agressor é mascarado na resposta.
  it("masks aggressor CPF", () => {
    expect(
      AggressorPresenter.toHTTP(
        new Aggressor({ id: "aggressor-1", name: "Joao", cpf: "12345678901" }),
      ),
    ).toEqual({
      id: "aggressor-1",
      name: "Joao",
      cpf: "123.***.***-01",
    });
  });

  // Garante que o CPF é mascarado e dados sensíveis (e-mail, senha) são omitidos.
  it("masks user CPF and omits sensitive data", () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");

    expect(
      UserPresenter.toHTTP(
        new User({
          id: "user-1",
          name: "Maria",
          cpf: "12345678901",
          email: "maria@example.com",
          password: "secret",
          createdAt,
        }),
      ),
    ).toEqual({
      id: "user-1",
      name: "Maria",
      cpf: "123.***.***-01",
      createdAt,
    });
  });

  // Garante que telefone e e-mail do contato de emergência são mascarados.
  it("masks emergency contact phone and email", () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-02T00:00:00.000Z");

    expect(
      EmergencyContactPresenter.toHTTP(
        new EmergencyContact({
          id: "contact-1",
          name: "Ana",
          phone: "11987654321",
          email: "ana@example.com",
          relationship: "IRMA",
          priority: 1,
          userId: "user-1",
          createdAt,
          updatedAt,
        }),
      ),
    ).toEqual({
      id: "contact-1",
      name: "Ana",
      phone: "(11) *****-4321",
      email: "ana***@example.com",
      relationship: "IRMA",
      priority: 1,
      userId: "user-1",
      createdAt,
      updatedAt,
    });
  });
});
