// Signin.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signin from "./Signin";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../../contexts/AuthContext";

// Giả lập API login
jest.mock("../../../api", () => ({
  fetchLogin: jest.fn(({ email, password }) => {
    if (email === "test@example.com" && password === "password123") {
      return Promise.resolve({ user: { email } });
    } else {
      return Promise.reject({ response: { data: { message: "Invalid credentials" } } });
    }
  }),
}));

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
};

describe("Signin form", () => {
  test("renders form fields", () => {
    renderWithProviders(<Signin history={{ push: jest.fn() }} />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("shows validation errors when fields are empty", async () => {
    renderWithProviders(<Signin history={{ push: jest.fn() }} />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is a required field/i)).toBeInTheDocument();
      expect(screen.getByText(/password is a required field/i)).toBeInTheDocument();
    });
  });

  test("shows error for invalid credentials", async () => {
    renderWithProviders(<Signin history={{ push: jest.fn() }} />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("redirects on successful login", async () => {
    const mockPush = jest.fn();
    renderWithProviders(<Signin history={{ push: mockPush }} />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/profile");
    });
  });
});
