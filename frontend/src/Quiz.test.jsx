import { act, fireEvent, render, screen } from "@testing-library/react";
import Quiz from "./Quiz";

describe("Quiz", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("starts a beginner quiz and advances after answering a question", async () => {
    vi.useFakeTimers();

    render(<Quiz onBack={vi.fn()} />);

    expect(screen.getByRole("button", { name: /back dashboard/i })).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /start quiz/i })[0]);

    expect(screen.getByText("Question 1 of 10")).toBeInTheDocument();
    expect(screen.getByText("What is a closure?")).toBeInTheDocument();
    expect(screen.getByText(/10:00/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Function with preserved scope" }),
    );

    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByText("Question 2 of 10")).toBeInTheDocument();
    expect(screen.getByText("Which declares a variable?")).toBeInTheDocument();
  });

  test("filters quizzes by difficulty tab", () => {
    render(<Quiz onBack={vi.fn()} />);

    expect(screen.getByText("Core JavaScript Concepts")).toBeInTheDocument();
    expect(screen.queryByText("Advanced C++ Concepts")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByText("Advanced C++ Concepts")).toBeInTheDocument();
    expect(screen.queryByText("Core JavaScript Concepts")).not.toBeInTheDocument();
  });
});
