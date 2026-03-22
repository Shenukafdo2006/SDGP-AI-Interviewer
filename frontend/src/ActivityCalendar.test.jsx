import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ActivityCalendar from "./ActivityCalendar";

let savedDatesDocs = [];
let eventsDocs = [];

const addDocMock = vi.fn();
const collectionMock = vi.fn((_, name) => ({ name }));
const whereMock = vi.fn((field, op, value) => ({ field, op, value }));
const queryMock = vi.fn((collectionRef, ...constraints) => ({
  collectionName: collectionRef.name,
  constraints,
}));
const onSnapshotMock = vi.fn((queryRef, onNext) => {
  const docsSource =
    queryRef.collectionName === "savedDates" ? savedDatesDocs : eventsDocs;

  onNext({
    docs: docsSource.map((doc) => ({
      id: doc.id,
      data: () => doc.data,
    })),
  });

  return vi.fn();
});
const serverTimestampMock = vi.fn(() => "mock-timestamp");

vi.mock("./firebase", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  addDoc: (...args) => addDocMock(...args),
  collection: (...args) => collectionMock(...args),
  onSnapshot: (...args) => onSnapshotMock(...args),
  query: (...args) => queryMock(...args),
  serverTimestamp: () => serverTimestampMock(),
  where: (...args) => whereMock(...args),
}));

function getDayCell(day) {
  const dayLabel = screen.getAllByText(new RegExp(`^${day}$`)).find(
    (element) => element.className === "day-number",
  );

  if (!dayLabel) {
    throw new Error(`Could not find calendar day ${day}`);
  }

  return dayLabel.closest(".calendar-cell");
}

function getExpectedDate(day) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

function getExpectedDisplayDate(day) {
  return new Date(`${getExpectedDate(day)}T00:00:00`).toLocaleString(
    "default",
    { month: "short", day: "numeric" },
  );
}

describe("ActivityCalendar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    savedDatesDocs = [];
    eventsDocs = [];
    addDocMock.mockResolvedValue({ id: "saved-date-1" });
  });

  test("calls onBack when the back button is clicked", async () => {
    const onBack = vi.fn();

    render(<ActivityCalendar onBack={onBack} />);

    await userEvent.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("shows an error when booking without a logged in user", async () => {
    render(<ActivityCalendar />);

    await userEvent.click(getDayCell(1));

    expect(screen.getByText(/not logged in!/i)).toBeInTheDocument();
    expect(addDocMock).not.toHaveBeenCalled();
  });

  test("books a date for a logged in user", async () => {
    localStorage.setItem("uid", "user-123");

    render(<ActivityCalendar />);

    await userEvent.click(getDayCell(1));

    await waitFor(() => {
      expect(addDocMock).toHaveBeenCalledTimes(1);
    });

    expect(addDocMock).toHaveBeenCalledWith(
      { name: "savedDates" },
      expect.objectContaining({
        uid: "user-123",
        date: getExpectedDate(1),
        type: "Interview",
        createdAt: "mock-timestamp",
      }),
    );
    expect(
      screen.getByText(new RegExp(`date booked: ${getExpectedDisplayDate(1)}`, "i")),
    ).toBeInTheDocument();
  });

  test("prevents booking a date that is already saved", async () => {
    localStorage.setItem("uid", "user-123");
    savedDatesDocs = [
      {
        id: "booked-1",
        data: { uid: "user-123", date: getExpectedDate(1), type: "Interview" },
      },
    ];

    render(<ActivityCalendar />);

    expect(
      within(screen.getByText(/upcoming tasks/i).closest(".tasks-card")).getByText(
        /interview/i,
      ),
    ).toBeInTheDocument();

    await userEvent.click(getDayCell(1));

    expect(
      screen.getByText(new RegExp(`date booked: ${getExpectedDisplayDate(1)}`, "i")),
    ).toBeInTheDocument();
    expect(addDocMock).not.toHaveBeenCalled();
  });
});
