import { fireEvent, render, screen } from "@testing-library/react";
import CVMaker from "./CVMaker";

// eslint-disable-next-line no-undef
describe("CVMaker", () => {
  // eslint-disable-next-line no-undef
  test("calls onBack when the back button is clicked", () => {
    // eslint-disable-next-line no-undef
    const onBack = vi.fn();

    render(<CVMaker onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    // eslint-disable-next-line no-undef
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // eslint-disable-next-line no-undef
  test("switches to smart scoring and alerts when analysis is attempted without CV content", () => {
    // eslint-disable-next-line no-undef
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    // eslint-disable-next-line no-undef
    render(<CVMaker onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /smart scoring/i }));
    fireEvent.click(screen.getByRole("button", { name: /analyze cv with ai/i }));

    // eslint-disable-next-line no-undef
    expect(alertSpy).toHaveBeenCalledWith(
      "Please upload or paste your CV content first.",
    );

    alertSpy.mockRestore();
  });

  // eslint-disable-next-line no-undef
  test("lets the user paste CV text in smart scoring mode", () => {
    // eslint-disable-next-line no-undef
    render(<CVMaker onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /smart scoring/i }));
    fireEvent.click(screen.getByRole("button", { name: /paste cv text/i }));

    const textarea = screen.getByPlaceholderText(
      /paste your cv text here to get a detailed ai analysis/i,
    );

    fireEvent.change(textarea, { target: { value: "React developer CV" } });

    // eslint-disable-next-line no-undef
    expect(textarea).toHaveValue("React developer CV");
  });

  // eslint-disable-next-line no-undef
  test("generates and displays the cover letter text", () => {
    // eslint-disable-next-line no-undef
    render(<CVMaker onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /cover letter/i }));
    fireEvent.click(screen.getByRole("button", { name: /generate cover letter/i }));

    const generatedLetter = screen.getByDisplayValue(/dear mrs\.poorna,/i);

    // eslint-disable-next-line no-undef
    expect(generatedLetter).toBeInTheDocument();
    // eslint-disable-next-line no-undef
    expect(generatedLetter.value).toContain("Sincerely,");
  });
});
