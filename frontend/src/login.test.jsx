import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Login from "./login";

const signInWithPopupMock = vi.fn();
const signInWithRedirectMock = vi.fn();
const getRedirectResultMock = vi.fn();

vi.mock("./firebase", () => ({
  auth: {},
  googleProvider: { providerId: "google" },
  githubProvider: { providerId: "github" },
}));

vi.mock("firebase/auth", () => ({
  signInWithPopup: (...args) => signInWithPopupMock(...args),
  signInWithRedirect: (...args) => signInWithRedirectMock(...args),
  getRedirectResult: (...args) => getRedirectResultMock(...args),
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
    getRedirectResultMock.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test("shows validation when email and password are missing", async () => {
    render(<Login />);

    await userEvent.click(screen.getByRole("button", { name: /^login$/i }));

    expect(screen.getByText(/please enter your email address\./i)).toBeInTheDocument();
  });

  test("submits email login and stores the user details", async () => {
    const onLoginSuccess = vi.fn();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        uid: "user-123",
        firstName: "Jane Doe",
      }),
    });

    render(<Login onLoginSuccess={onLoginSuccess} />);

    await userEvent.type(screen.getByPlaceholderText(/john@example\.com/i), "jane@example.com");
    await userEvent.type(screen.getByPlaceholderText(/••••••••/i), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "jane@example.com",
            password: "secret123",
          }),
        }),
      );
    });

    expect(localStorage.getItem("uid")).toBe("user-123");
    expect(localStorage.getItem("email")).toBe("jane@example.com");
    expect(localStorage.getItem("firstName")).toBe("Jane");
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
  });

  test("handles google login and saves the returned user", async () => {
    const onLoginSuccess = vi.fn();
    signInWithPopupMock.mockResolvedValue({
      user: {
        uid: "google-1",
        email: "alex@example.com",
        displayName: "Alex Johnson",
      },
    });

    render(<Login onLoginSuccess={onLoginSuccess} />);

    await userEvent.click(screen.getByRole("button", { name: /^google$/i }));

    await waitFor(() => {
      expect(signInWithPopupMock).toHaveBeenCalledTimes(1);
    });

    expect(localStorage.getItem("uid")).toBe("google-1");
    expect(localStorage.getItem("email")).toBe("alex@example.com");
    expect(localStorage.getItem("firstName")).toBe("Alex");
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
  });

  test("falls back to redirect when the social login popup is blocked", async () => {
    signInWithPopupMock.mockRejectedValue({
      code: "auth/popup-blocked",
      message: "Popup blocked by the browser",
    });
    signInWithRedirectMock.mockResolvedValue(undefined);

    render(<Login />);

    await userEvent.click(screen.getByRole("button", { name: /^google$/i }));

    await waitFor(() => {
      expect(signInWithPopupMock).toHaveBeenCalledTimes(1);
      expect(signInWithRedirectMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText(/popup blocked by the browser/i)).not.toBeInTheDocument();
  });

  test("restores the user after redirect login completes", async () => {
    const onLoginSuccess = vi.fn();
    getRedirectResultMock.mockResolvedValue({
      user: {
        uid: "redirect-1",
        email: "sam@example.com",
        displayName: "Sam Perera",
      },
    });

    render(<Login onLoginSuccess={onLoginSuccess} />);

    await waitFor(() => {
      expect(localStorage.getItem("uid")).toBe("redirect-1");
    });

    expect(localStorage.getItem("email")).toBe("sam@example.com");
    expect(localStorage.getItem("firstName")).toBe("Sam");
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
  });

  test("triggers forgot password and sign up actions", async () => {
    const onForgotPassword = vi.fn();
    const onGoToSignup = vi.fn();

    render(
      <Login
        onForgotPassword={onForgotPassword}
        onGoToSignup={onGoToSignup}
      />,
    );

    await userEvent.click(screen.getByText(/forgot password\?/i));
    await userEvent.click(screen.getByText(/create one/i));

    expect(onForgotPassword).toHaveBeenCalledTimes(1);
    expect(onGoToSignup).toHaveBeenCalledTimes(1);
  });
});
