import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { UserForm } from "./user-form";

const mockMutate = jest.fn();

// Mock the useCreateUser hook
jest.mock("@/data/hooks/use-create-user", () => ({
  useCreateUser: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

// Mock the UI components used in UserFormast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Valida o formulário de criação de usuário (renderização e submissão com CPF sanitizado).
describe("UserForm", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  // Garante que o formulário renderiza os campos de nome/CPF e o botão de criar.
  it("renders the form", () => {
    render(<UserForm />);
    expect(
      screen.getByRole("button", { name: /criar usuário/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
  });

  // Garante que ao submeter o mutate é chamado com o CPF sem máscara (só dígitos).
  it("submits the form", async () => {
    render(<UserForm />);

    fireEvent.input(screen.getByLabelText(/nome/i), {
      target: { value: "Maria Silva" },
    });
    fireEvent.input(screen.getByLabelText(/cpf/i), {
      target: { value: "529.982.247-25" },
    });

    fireEvent.click(screen.getByRole("button", { name: /criar usuário/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { name: "Maria Silva", cpf: "52998224725" },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
    });
  });
});
