import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import JobPostingReview from "./JobPostingReview";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("JobPostingReview", () => {
  test("approves a reviewed posting with its role family and skills", async () => {
    const pendingImport = {
      id: 13,
      originalFilename: "ML_part5.pdf",
      reviewStatus: "pending",
      uploadedAt: "2026-10-10T12:00:00.000Z",
      extractedText: "Sample extracted posting text",
    };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ imports: [pendingImport] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ status: "approved", postingIds: [55] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ imports: [] }) });
    vi.stubGlobal("fetch", fetchMock);

    render(<JobPostingReview />);

    expect(await screen.findByText("Sample extracted posting text")).toBeInTheDocument();
    expect(screen.getByLabelText("CV template category")).toHaveValue("intern-data-scientist");
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Example AI" } });
    fireEvent.change(screen.getByLabelText("Role title"), { target: { value: "ML Engineer Intern" } });
    fireEvent.change(screen.getByLabelText("CV template category"), {
      target: { value: "intern-data-scientist" },
    });
    fireEvent.change(screen.getByLabelText(/Required skills/), {
      target: { value: "Python, PyTorch" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred skills/), {
      target: { value: "Docker" },
    });

    fireEvent.click(screen.getByRole("button", { name: /approve 1 posting/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    const reviewCall = fetchMock.mock.calls[1];
    expect(reviewCall[0]).toBe("/api/jobs/admin/imports/13/review");
    expect(JSON.parse(reviewCall[1].body)).toEqual({
      postings: [expect.objectContaining({
        companyName: "Example AI",
        roleTitle: "ML Engineer Intern",
        roleFamily: "intern-data-scientist",
        requiredSkills: ["Python", "PyTorch"],
        preferredSkills: ["Docker"],
      })],
    });
    expect(await screen.findByText("No pending PDFs. Import one above to begin.")).toBeInTheDocument();
  });
});
