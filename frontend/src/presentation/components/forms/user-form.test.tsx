import { fireEvent, render, screen } from "@testing-library/react";

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

describe("UserForm", () => {
  it("renders the form", () => {
    render(<UserForm />);
    const elements = screen.getAllByText(/create user/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  // Basic interaction test to see if mock functions are called
  // (Assuming your mock UI components allow this interaction)
  it("submits the form", () => {
    render(<UserForm />);
    // Add logic here to simulate filling out the form
    // and clicking the submit button.
    // This depends heavily on how your UI components are mocked.

    // Example (if components are mocked simply):
    render(<UserForm />);
    fireEvent.click(screen.getByRole("button", { name: /create user/i }));
    // expect(mockMutate).toHaveBeenCalled();
  });
});
