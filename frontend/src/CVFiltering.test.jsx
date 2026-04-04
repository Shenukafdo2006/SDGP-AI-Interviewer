import { fireEvent, render, screen, within } from "@testing-library/react";
import CVFiltering from "./CVFiltering";

describe("CVFiltering", () => {
  test("calls onBack when the back button is clicked", () => {
    const onBack = vi.fn();

    render(<CVFiltering onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("applies position filters and shows the filtered candidate count", () => {
    const { container } = render(<CVFiltering onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /filter/i }));

    const positionSelect = container.querySelector('select[name="position"]');

    fireEvent.change(positionSelect, {
      target: { value: "Intern Data Scientist" },
    });
    fireEvent.click(screen.getByRole("button", { name: /apply filters/i }));

    expect(screen.getByText(/found 1 matching cvs/i)).toBeInTheDocument();
    expect(screen.getByText("1 results")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kaveesha Fernandupulle" })).toBeInTheDocument();
  });

  test("opens the candidate modal from the filter results", () => {
    render(<CVFiltering onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /filter/i }));
    fireEvent.click(screen.getByRole("heading", { name: "Pavithri pabasara" }));

    expect(screen.getByText(/contact information/i)).toBeInTheDocument();
    expect(screen.getByText(/professional summary/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /schedule interview/i })).toBeInTheDocument();
  });

  test("shows search suggestions and allows selecting one", () => {
    render(<CVFiltering onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    const searchInput = screen.getByPlaceholderText(
      /search skills, experience, location/i,
    );

    fireEvent.change(searchInput, { target: { value: "Re" } });

    const suggestions = screen.getAllByText(/react/i);
    fireEvent.click(suggestions[0]);

    expect(searchInput).toHaveValue("React");

    const tipsSection = screen.getByText(/search tips/i).closest(".cvf-tips");
    expect(within(tipsSection).getByText(/boolean search/i)).toBeInTheDocument();
  });
});
