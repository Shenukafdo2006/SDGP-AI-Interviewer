import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Achievements from "./Achievements";

const docMock = vi.fn(() => "doc-ref");
const getDocMock = vi.fn();
const setDocMock = vi.fn();
const updateDocMock = vi.fn();
const arrayUnionMock = vi.fn((value) => value);

vi.mock("./firebase", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  arrayUnion: (...args) => arrayUnionMock(...args),
  doc: (...args) => docMock(...args),
  getDoc: (...args) => getDocMock(...args),
  setDoc: (...args) => setDocMock(...args),
  updateDoc: (...args) => updateDocMock(...args),
}));

async function renderLoadedAchievements(props = {}) {
  render(<Achievements {...props} />);
  await screen.findByText(/your achievements/i);
}

describe("Achievements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("uid", "user-123");

    getDocMock.mockResolvedValue({
      exists: () => false,
    });
    setDocMock.mockResolvedValue();
    updateDocMock.mockResolvedValue();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  test("calls onBack when the back button is clicked", async () => {
    const onBack = vi.fn();

    await renderLoadedAchievements({ onBack });

    fireEvent.click(screen.getByRole("button", { name: /back to dashboard/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("unlocks an achievement and saves it to firestore", async () => {
    await renderLoadedAchievements();

    fireEvent.click(screen.getAllByRole("button", { name: /locked/i })[0]);

    expect(screen.getByText(/saving achievement/i)).toBeInTheDocument();

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(setDocMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/saved to firebase!/i)).toBeInTheDocument();
    expect(screen.getByText(/1 of 6 unlocked/i)).toBeInTheDocument();
    expect(screen.getByText(/^unlocked$/i)).toBeInTheDocument();
  });

  test("updates the level after the level-up timeout completes", async () => {
    await renderLoadedAchievements();
    vi.useFakeTimers();

    fireEvent.click(screen.getAllByRole("button", { name: /locked/i })[0]);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getAllByText(/level 1/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/5 remaining/i)).toBeInTheDocument();
  });
});
