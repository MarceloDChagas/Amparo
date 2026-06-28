import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import { CreateAggressorUseCase } from "@/core/use-cases/aggressor/create-aggressor.use-case";
import { DeleteAggressorUseCase } from "@/core/use-cases/aggressor/delete-aggressor.use-case";
import { GetAggressorUseCase } from "@/core/use-cases/aggressor/get-aggressor.use-case";
import { UpdateAggressorUseCase } from "@/core/use-cases/aggressor/update-aggressor.use-case";

// Valida os casos de uso de CRUD de agressor (criar, buscar, listar, atualizar, remover).
describe("Aggressor use cases", () => {
  const aggressorRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Garante que criar persiste o agressor no repositório e devolve a entidade.
  it("creates an aggressor", async () => {
    const aggressor = new Aggressor({
      id: "aggressor-1",
      name: "Joao",
      cpf: "12345678901",
    });
    aggressorRepository.create.mockResolvedValue(aggressor);

    await expect(
      new CreateAggressorUseCase(aggressorRepository).execute(aggressor),
    ).resolves.toEqual(aggressor);
    expect(aggressorRepository.create).toHaveBeenCalledWith(aggressor);
  });

  // Garante que buscar por id delega ao repositório com o id correto.
  it("returns an aggressor by id", async () => {
    const aggressor = { id: "aggressor-1" };
    aggressorRepository.findById.mockResolvedValue(aggressor);

    await expect(
      new GetAggressorUseCase(aggressorRepository).execute("aggressor-1"),
    ).resolves.toEqual(aggressor);
    expect(aggressorRepository.findById).toHaveBeenCalledWith("aggressor-1");
  });

  // Garante que a listagem retorna todos os agressores cadastrados.
  it("returns all aggressors", async () => {
    const aggressors = [{ id: "aggressor-1" }, { id: "aggressor-2" }];
    aggressorRepository.findAll.mockResolvedValue(aggressors);

    await expect(
      new GetAggressorUseCase(aggressorRepository).executeFindAll(),
    ).resolves.toEqual(aggressors);
    expect(aggressorRepository.findAll).toHaveBeenCalledTimes(1);
  });

  // Garante que atualizar repassa id e dados parciais ao repositório.
  it("updates an aggressor", async () => {
    const updated = { id: "aggressor-1", name: "Updated" };
    aggressorRepository.update.mockResolvedValue(updated);

    await expect(
      new UpdateAggressorUseCase(aggressorRepository).execute("aggressor-1", {
        name: "Updated",
      }),
    ).resolves.toEqual(updated);
    expect(aggressorRepository.update).toHaveBeenCalledWith("aggressor-1", {
      name: "Updated",
    });
  });

  // Garante que remover delega a exclusão ao repositório pelo id.
  it("deletes an aggressor", async () => {
    aggressorRepository.delete.mockResolvedValue(undefined);

    await expect(
      new DeleteAggressorUseCase(aggressorRepository).execute("aggressor-1"),
    ).resolves.toBeUndefined();
    expect(aggressorRepository.delete).toHaveBeenCalledWith("aggressor-1");
  });
});
