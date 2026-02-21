import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { useCreateEmergencyAlert } from "@/hooks/use-emergency-alert";
import { useAuth } from "@/presentation/hooks/useAuth";

import { EmergencyButton } from "../EmergencyButton";

// Mocking hooks
jest.mock("@/presentation/hooks/useAuth");
jest.mock("@/hooks/use-emergency-alert");
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock Geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementation((success) =>
    success({
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
    }),
  ),
};

// Use defineProperty to avoid @typescript-eslint/no-explicit-any
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  configurable: true,
  writable: true,
});

describe("EmergencyButton", () => {
  const mockMutate = jest.fn();
  const mockUser = { id: "user-123", name: "Test User" };

  beforeEach(() => {
    jest.useFakeTimers();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useCreateEmergencyAlert as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should not trigger alert immediately on mouseDown", () => {
    render(<EmergencyButton />);
    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should trigger alert after 2 seconds of holding", () => {
    render(<EmergencyButton />);
    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: -23.5505,
        longitude: -46.6333,
        victimId: "user-123",
      }),
    );
  });

  it("should reset progress and NOT trigger alert if released early", () => {
    render(<EmergencyButton />);
    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);

    act(() => {
      jest.advanceTimersByTime(1000); // 1 second
    });

    fireEvent.mouseUp(button);

    act(() => {
      jest.advanceTimersByTime(2000); // Another 2 seconds
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show 'SEGURE...' text while pressing", () => {
    render(<EmergencyButton />);
    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);

    expect(screen.getByText(/SEGURE.../i)).toBeInTheDocument();
  });
});
