import { fireEvent, render, screen } from "@testing-library/react";
import CVMaker from "./CVMaker";

// eslint-disable-next-line no-undef
describe("CVMaker", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // eslint-disable-next-line no-undef
  test("calls onBack when the back button is clicked", () => {
    // eslint-disable-next-line no-undef
    const onBack = vi.fn();

    render(<CVMaker onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    // eslint-disable-next-line no-undef
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("uses the matching image preview for each CV template", () => {
    render(<CVMaker onBack={vi.fn()} />);

    expect(screen.getByRole("img", { name: "Intern Software Engineer template preview" })).toHaveAttribute("src", "/images/SE.jpg");
    expect(screen.getByRole("img", { name: "Intern Data Scientist template preview" })).toHaveAttribute("src", "/images/DataScientist.jpg");
    expect(screen.getByRole("img", { name: "Intern UX/UI Designer template preview" })).toHaveAttribute("src", "/images/UI-_-UX-Design.webp");
    expect(screen.getByRole("img", { name: "Intern Quality Assurance template preview" })).toHaveAttribute("src", "/images/QA.jpeg");
    expect(screen.getByRole("img", { name: "Intern Web Developer template preview" })).toHaveAttribute("src", "/images/WebDeveloper.jpeg");
    expect(screen.getByRole("img", { name: "Intern Project Manager template preview" })).toHaveAttribute("src", "/images/PM.jpg");
  });

  test("loads approved role requirements and adds a confirmed skill to the CV", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        jobCount: 1,
        recommendations: [
          { skill: "GraphQL", skillType: "required", postingCount: 1 },
          { skill: "REST APIs", skillType: "preferred", postingCount: 1 },
        ],
      }),
    }));

    const { container } = render(<CVMaker onBack={vi.fn()} />);
    fireEvent.focus(screen.getByPlaceholderText(/select an intern role/i));
    fireEvent.click(container.querySelector(".cvmaker-role-option"));

    expect(await screen.findByText(/based on 1 approved job posting/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /edit & customize cv/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /skills/i }));
    fireEvent.click(await screen.findByRole("button", { name: "Add GraphQL to CV" }));

    expect(screen.getByDisplayValue("GraphQL")).toBeInTheDocument();
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
