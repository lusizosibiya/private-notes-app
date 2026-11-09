import { useState } from "react";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import favicon from "../assets/images/favicon.png";
import FormInput from "../components/authorisation/FormInput";
import { apiRequest } from "../services/api";

function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      window.location.assign("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-5 xl:px-8">
      <div className="w-full max-w-lg rounded-2xl bg-[#D5D1D1] px-6 py-6 text-[#280A08] shadow-2xl shadow-black/20 sm:px-8 sm:py-7 lg:px-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#652423] text-[#E9E8E8]">
          <img src={favicon} alt="" className="h-6 w-6 object-contain" />
        </div>

        <header className="mb-5 text-center">
          <h1 className="font-serif text-xl font-semibold sm:text-2xl">
            Create Your Account
          </h1>
          <p className="mt-1.5 text-sm text-[#280A08]/80 sm:text-base">
            Sign up to start keeping your private notes.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-[#652423]/10 px-3 py-2 text-sm text-[#652423]"
            >
              {error}
            </p>
          )}

          <FormInput
            id="name"
            label="Full Name"
            placeholder="Enter your name"
            icon={FiUser}
            autoComplete="name"
          />

          <FormInput
            id="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            icon={FiMail}
            autoComplete="email"
          />

          <FormInput
            id="password"
            label="Password"
            placeholder="Create a password"
            type="password"
            icon={FiLock}
            autoComplete="new-password"
          />

          <FormInput
            id="confirm-password"
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            icon={FiLock}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-[#652423] px-5 py-3 text-sm font-semibold text-[#E9E8E8] transition hover:bg-[#501c1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#652423] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#280A08] sm:text-base">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-[#652423] underline-offset-2 hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </section>
  );
}

export default Register;
