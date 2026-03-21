import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashBoard from "./DashBoard";

describe("DashBoard", () => {
  test("opens the training view from the hero button", async () => {
    const setView = vi.fn();

    render(<DashBoard setView={setView} />);

    await userEvent.click(
      screen.getByRole("button", { name: /continue learning/i }),
    );

    expect(setView).toHaveBeenCalledWith("training");
  });

  test("routes quick actions to the expected views", async () => {
    const setView = vi.fn();

    render(<DashBoard setView={setView} />);

    await userEvent.click(
      screen.getByRole("button", { name: /start mock interview/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /take skills quiz/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /upload\/update cv/i }),
    );

    expect(setView).toHaveBeenCalledWith("training");
    expect(setView).toHaveBeenCalledWith("quiz");
    expect(setView).toHaveBeenCalledWith("cv-maker");
  });
});
