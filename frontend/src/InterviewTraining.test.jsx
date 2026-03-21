import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InterviewTraining from "./InterviewTraining";
import { startInterview } from "./api/interviewApi";

vi.mock("./api/interviewApi", () => ({
  startInterview: vi.fn(),
}));

describe("InterviewTraining", () => {
  test("starts an interview with default selections", async () => {
    const onStartInterview = vi.fn();

    startInterview.mockResolvedValue({
      sessionId: "session-123",
      question: "Tell me about yourself",
      index: 0,
      total: 5,
    });

    render(<InterviewTraining onStartInterview={onStartInterview} />);

    await userEvent.click(
      screen.getByRole("button", { name: /start interview/i }),
    );

    await waitFor(() => {
      expect(startInterview).toHaveBeenCalledWith({
        role: "Software Engineer",
        level: "Entry Level (0-1 Years)",
        interviewType: "Technical",
      });
    });

    expect(onStartInterview).toHaveBeenCalledWith({
      sessionId: "session-123",
      question: "Tell me about yourself",
      index: 0,
      total: 5,
      role: "Software Engineer",
      level: "Entry Level (0-1 Years)",
      interviewType: "Technical",
      interviewMode: "video",
    });
  });

  test("shows an error when the interview cannot be started", async () => {
    startInterview.mockRejectedValue(new Error("Unable to start interview"));

    render(<InterviewTraining onStartInterview={vi.fn()} />);

    await userEvent.click(
      screen.getByRole("button", { name: /start interview/i }),
    );

    expect(
      await screen.findByText("Unable to start interview"),
    ).toBeInTheDocument();
  });
});
