import { act, fireEvent, render, screen, within } from "@testing-library/react";
import CareerSuggestions from "./CareerSuggestions";

describe("CareerSuggestions", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("calls onBack when the back button is clicked", () => {
    const onBack = vi.fn();
    const { container } = render(<CareerSuggestions onBack={onBack} />);

    fireEvent.click(container.querySelector(".go-back-button"));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("adds unique skills, removes skills, and toggles interests", () => {
    const { container } = render(<CareerSuggestions onBack={vi.fn()} />);

    const skillInput = screen.getByPlaceholderText(/enter a skill/i);
    const addButton = screen.getAllByRole("button", { name: /^add$/i })[0];
    const skillTags = container.querySelector(".skill-tags-container");
    const frontendInterest = screen.getByRole("button", {
      name: "Frontend Development",
    });

    fireEvent.change(skillInput, { target: { value: "React" } });
    fireEvent.click(addButton);

    expect(within(skillTags).getByText("React")).toBeInTheDocument();

    fireEvent.change(skillInput, { target: { value: "react" } });
    fireEvent.click(addButton);

    expect(within(skillTags).getAllByText("React")).toHaveLength(1);

    fireEvent.click(frontendInterest);

    expect(frontendInterest).toHaveClass("selected");

    fireEvent.click(container.querySelector(".skill-tag-remove"));

    expect(within(skillTags).queryByText("React")).not.toBeInTheDocument();
  });

  test("analyzes the profile and ranks matching careers", () => {
    vi.useFakeTimers();

    const { container } = render(<CareerSuggestions onBack={vi.fn()} />);
    const skillInput = screen.getByPlaceholderText(/enter a skill/i);

    fireEvent.change(skillInput, { target: { value: "React" } });
    fireEvent.click(screen.getAllByRole("button", { name: /^add$/i })[0]);
    fireEvent.click(
      screen.getByRole("button", { name: "Frontend Development" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /analyze & get recommendations/i }),
    );

    expect(screen.getByText(/analyzing your profile/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(
      screen.getByRole("heading", { name: /recommended careers/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/% match/i).length).toBeGreaterThan(0);

    const titles = [
      ...container.querySelectorAll(".career-card-title"),
    ].map((node) => node.textContent);

    expect(titles[0]).toBe("Full Stack Developer");
  });

  test("shows internship requirements and opens the detail view", () => {
    render(<CareerSuggestions onBack={vi.fn()} />);

    const firstCard = screen
      .getByRole("heading", { name: "Software Engineer" })
      .closest(".career-card");

    expect(firstCard).not.toBeNull();

    const cardQueries = within(firstCard);

    fireEvent.click(
      cardQueries.getByRole("button", { name: /internship requirements/i }),
    );

    expect(
      cardQueries.getByText(/pursuing or completed a degree/i),
    ).toBeInTheDocument();

    fireEvent.click(cardQueries.getByRole("button", { name: /explore/i }));

    expect(
      screen.getByRole("button", { name: /back to suggestions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/job description/i)).toBeInTheDocument();
    expect(screen.getByText(/why this career/i)).toBeInTheDocument();
  });
});
