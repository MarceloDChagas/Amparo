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

// Mock Geolocation — emits a short stream of tight, identical GPS fixes so the
// Kalman filter in geolocation.ts converges (mirrors a real high-accuracy GPS).
const FIX = { latitude: -23.5505, longitude: -46.6333, accuracy: 4 };

const mockGeolocation = {
  getCurrentPosition: jest
    .fn()
    .mockImplementation((success) =>
      success({ coords: FIX, timestamp: Date.now() }),
    ),
  watchPosition: jest.fn().mockImplementation((success) => {
    for (let i = 0; i < 4; i++) {
      success({ coords: FIX, timestamp: Date.now() + i * 1000 });
    }
    return 1;
  }),
  clearWatch: jest.fn(),
};

// Use defineProperty to avoid @typescript-eslint/no-explicit-any
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  configurable: true,
  writable: true,
});

// Valida o botão de emergência: aciona o alerta só após 2s de pressão e sempre com localização válida.
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
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  // Garante que apenas pressionar (mouseDown) não dispara o alerta de imediato.
  it("should not trigger alert immediately on mouseDown", () => {
    render(<EmergencyButton />);
    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  // Garante que segurar por 2s dispara o alerta com as coordenadas e o usuário.
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
        longitude: expect.any(Number),
        userId: "user-123",
        // test will not enforce aggressorId if not present
      }),
    );
  });

  // Garante que soltar antes dos 2s reseta o progresso e não dispara o alerta.
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

  // Garante que a contagem regressiva é exibida enquanto o botão é pressionado.
  it("should show countdown text while pressing", () => {
    render(<EmergencyButton />);
    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);

    expect(screen.getByText(/2s/i)).toBeInTheDocument();
  });

  // Regression: on a device that only has a coarse fix (desktop / weak signal),
  // the alert must still carry that location — never the (0, 0) fallback that
  // was being stored before. Kept last because it overrides watchPosition.
  it("sends the coarse location (never 0,0) when GPS only has a weak fix", async () => {
    mockGeolocation.watchPosition.mockImplementation((success) => {
      success({
        coords: { latitude: -8.33, longitude: -36.42, accuracy: 1500 },
        timestamp: Date.now(),
      });
      return 1;
    });

    render(<EmergencyButton />);
    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);
    // 2 s hold completes → getBestPosition runs → resolves via the stall timer.
    await act(async () => {
      await jest.advanceTimersByTimeAsync(6000);
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: -8.33,
        longitude: expect.any(Number),
        userId: "user-123",
      }),
    );
    expect(mockMutate).not.toHaveBeenCalledWith(
      expect.objectContaining({ latitude: 0, longitude: 0 }),
    );
  });
});
