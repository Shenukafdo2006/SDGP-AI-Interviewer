import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "./signup";

describe("Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("shows validation when required fields are missing", async () => {
    render(<Signup />);

    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/please enter your first and last name\./i)).toBeInTheDocument();
  });

  test("toggles password visibility", async () => {
    render(<Signup />);

    const passwordInput = screen.getByPlaceholderText(/\*{6}/i);
    const toggleButton = screen.getByRole("button", { name: /show/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /hide/i })).toBeInTheDocument();
  });

  test("submits the signup form and calls onSignupSuccess", async () => {
    const onSignupSuccess = vi.fn();
    fetch.mockResolvedValue({
      json: async () => ({ success: true }),
    });

    render(<Signup onSignupSuccess={onSignupSuccess} />);

    await userEvent.type(screen.getByPlaceholderText("John"), "Jane");
    await userEvent.type(screen.getByPlaceholderText("Doe"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("john@email.com"), "jane@example.com");
    await userEvent.type(screen.getByPlaceholderText(/\*{6}/i), "secret123");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            password: "secret123",
          }),
        },
      );
    });

    expect(onSignupSuccess).toHaveBeenCalledTimes(1);
  });

  test("calls onGoToLogin when sign in is clicked", async () => {
    const onGoToLogin = vi.fn();

    render(<Signup onGoToLogin={onGoToLogin} />);

    await userEvent.click(screen.getByText(/sign in/i));

    expect(onGoToLogin).toHaveBeenCalledTimes(1);
  });
});
