import { render, screen } from "@testing-library/react";

import { VictimForm } from "./victim-form";

// Mock the useCreateVictim hook
jest.mock("@/data/hooks/use-create-victim", () => ({
  useCreateVictim: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("VictimForm", () => {
  it("renders the form with correct title", () => {
    render(<VictimForm />);
    const elements = screen.getAllByText(/create victim/i);
    // First element should be the CardTitle, second is the button
    expect(elements[0]).toBeInTheDocument();
    expect(elements[0]).toHaveAttribute("data-slot", "card-title");
  });

  it("renders name and CPF input fields", () => {
    render(<VictimForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<VictimForm />);
    expect(
      screen.getByRole("button", { name: /create victim/i }),
    ).toBeInTheDocument();
  });
});
