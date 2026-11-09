import { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import favicon from "../assets/images/favicon.png";
import FormInput from "../components/authorisation/FormInput";
import { rememberLoggedInUser } from "../utils/userProfile";

function Login() {
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!rememberLoggedInUser(formData.get("email"))) {
      setError("No account found for this email on this device. Please sign up first.");
      return;
    }

    window.location.assign("/");
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-5 xl:px-8">
      <div className="w-full max-w-lg rounded-2xl bg-[#D5D1D1] px-6 py-8 text-[#280A08] shadow-2xl shadow-black/20 sm:px-8 sm:py-9 lg:px-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#652423]">
          <img src={favicon} alt="" className="h-7 w-7 object-contain" />
        </div>

        <header className="mb-7 text-center">
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-[#280A08]/80 sm:text-base">
            Log in to access your thoughts and notes.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-[#652423]/10 px-3 py-2 text-sm text-[#652423]"
            >
              {error}
            </p>
          )}
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
            placeholder="Enter your password"
            type="password"
            icon={FiLock}
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-[#652423] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#652423] px-5 py-3.5 text-sm font-semibold text-[#E9E8E8] transition hover:bg-[#501c1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#652423] sm:text-base"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#280A08] sm:text-base">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-[#652423] underline-offset-2 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </section>
  );
}

export default Login;
