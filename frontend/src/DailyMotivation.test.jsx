import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DailyMotivation from "./DailyMotivation";

describe("DailyMotivation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("calls onBack when the back button is clicked", async () => {
    const onBack = vi.fn();

    render(<DailyMotivation onBack={onBack} />);

    await userEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("generates a new quote when requested", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.6);

    render(<DailyMotivation onBack={vi.fn()} />);

    expect(
      screen.getByText(/the only way to do great work is to love what you do/i),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /new quote/i }));

    expect(
      screen.getByText(/believe you can and you're halfway there/i),
    ).toBeInTheDocument();
  });

  test("adds a new intention and a new habit", async () => {
    render(<DailyMotivation onBack={vi.fn()} />);

    const intentionInput = screen.getByPlaceholderText(/add a new intention/i);
    const habitInput = screen.getByPlaceholderText(/add a new habit/i);
    const addButtons = screen.getAllByRole("button", { name: /^add$/i });

    await userEvent.type(intentionInput, "Finish my portfolio");
    await userEvent.click(addButtons[0]);

    expect(screen.getByText(/finish my portfolio/i)).toBeInTheDocument();

    await userEvent.type(habitInput, "Journaling");
    await userEvent.click(addButtons[1]);

    const habitCard = screen.getByText("Journaling").closest(".habit-item");

    expect(screen.getByText("Journaling")).toBeInTheDocument();
    expect(habitCard).not.toBeNull();
    expect(within(habitCard).getByText(/0/)).toBeInTheDocument();
  });

  test("toggles a habit and updates its streak", async () => {
    render(<DailyMotivation onBack={vi.fn()} />);

    const meditationCard = screen.getByText("Meditation").closest(".habit-item");

    expect(meditationCard).not.toBeNull();
    expect(within(meditationCard).getByText(/12/)).toBeInTheDocument();

    await userEvent.click(
      within(meditationCard).getByRole("button", { name: /mark done/i }),
    );

    expect(
      within(meditationCard).getByRole("button", { name: /completed today/i }),
    ).toBeInTheDocument();
    expect(within(meditationCard).getByText(/13/)).toBeInTheDocument();

    await userEvent.click(
      within(meditationCard).getByRole("button", { name: /completed today/i }),
    );

    expect(
      within(meditationCard).getByRole("button", { name: /mark done/i }),
    ).toBeInTheDocument();
    expect(within(meditationCard).getByText(/12/)).toBeInTheDocument();
  });
});
