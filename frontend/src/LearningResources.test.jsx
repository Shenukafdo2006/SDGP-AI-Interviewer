import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LearningResources from "./LearningResources";

describe("LearningResources", () => {
  test("renders the page header and summary stats", () => {
    render(<LearningResources onBack={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /learning path/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome back! you have 3 courses in progress\./i)).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText(/0h/i)).toBeInTheDocument();
  });

  test("calls onBack when the back button is clicked", async () => {
    const onBack = vi.fn();

    render(<LearningResources onBack={onBack} />);

    await userEvent.click(screen.getByRole("button", { name: /back to home/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("renders resource cards with course links", () => {
    render(<LearningResources onBack={vi.fn()} />);

    const firstCard = screen.getByText(/w3schools - learn web development/i).closest(".desktop-res-card");

    expect(firstCard).not.toBeNull();
    expect(within(firstCard).getByText(/by w3schools/i)).toBeInTheDocument();
    expect(within(firstCard).getByText(/beginner/i)).toBeInTheDocument();
    expect(within(firstCard).getByText(/★ 4\.5/i)).toBeInTheDocument();

    const startCourseLinks = screen.getAllByRole("link", { name: /start course/i });

    expect(startCourseLinks).toHaveLength(9);
    expect(startCourseLinks[0]).toHaveAttribute("href", "https://www.w3schools.com/");
    expect(startCourseLinks[0]).toHaveAttribute("target", "_blank");
  });
});
