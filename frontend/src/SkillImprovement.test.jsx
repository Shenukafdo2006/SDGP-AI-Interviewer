import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkillImprovement from "./SkillImprovement";
import { getUserProgress, updateGoalProgress } from "./api/skillApi";

vi.mock("./api/skillApi", () => ({
  getUserProgress: vi.fn(),
  updateGoalProgress: vi.fn(),
}));

describe("SkillImprovement", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("loads user progress and updates a goal when clicked", async () => {
    localStorage.setItem("uid", "user-123");

    getUserProgress.mockResolvedValue({
      goals: {
        coding: { current: 3, total: 5 },
        learning: { current: 2, total: 2 },
        interview: { current: 0, total: 1 },
        project: { current: 1, total: 1 },
      },
    });

    updateGoalProgress.mockResolvedValue({
      goals: {
        coding: { current: 4, total: 5 },
        learning: { current: 2, total: 2 },
        interview: { current: 0, total: 1 },
        project: { current: 1, total: 1 },
      },
    });

    render(<SkillImprovement onBack={vi.fn()} />);

    expect(screen.getByText(/loading progress data/i)).toBeInTheDocument();

    expect(await screen.findByRole("heading", { name: /skill improvement/i })).toBeInTheDocument();
    expect(getUserProgress).toHaveBeenCalledWith("user-123");
    expect(
      screen.getByText((_, element) => element?.textContent === "2 Goals Completed"),
    ).toBeInTheDocument();
    expect(screen.getByText("3/5 completed")).toBeInTheDocument();

    const codingButton = screen.getAllByRole("button", { name: /mark as done/i })[0];
    await userEvent.click(codingButton);

    await waitFor(() => {
      expect(updateGoalProgress).toHaveBeenCalledWith({
        uid: "user-123",
        category: "coding",
        current: 4,
      });
    });

    expect(await screen.findByText("4/5 completed")).toBeInTheDocument();
  });

  test("shows an error state when loading progress fails", async () => {
    localStorage.setItem("uid", "user-123");
    getUserProgress.mockRejectedValue(new Error("boom"));

    render(<SkillImprovement onBack={vi.fn()} />);

    expect(await screen.findByText(/failed to load progress data/i)).toBeInTheDocument();
  });
});
