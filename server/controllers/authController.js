import { supabase } from "../config/supabase.js";
import { setAuthCookies, clearAuthCookies } from "../config/cookies.js";
import { createAuthClient } from "../config/supabase.js";

export async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
        emailRedirectTo: `${process.env.CLIENT_URL}/login`,
      },
    });

    if (error) {
      return res.status(error.status || 400).json({
        message: error.message,
      });
    }

    return res.status(201).json({
      message:
        "Registration request received. Check your email if confirmation is required.",
      requiresEmailConfirmation: !data.session,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong during registration.",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.session) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    setAuthCookies(res, data.session);

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong during login.",
    });
  }
}

export function getCurrentUser(req, res) {
  const user = req.user;

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || "",
    },
  });
}

export function logout(req, res) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "Logged out successfully.",
  });
}

export async function refreshSession(req, res) {
  res.set("Cache-Control", "no-store");

  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No refresh token available.",
    });
  }

  try {
    const authClient = createAuthClient();

    const { data, error } = await authClient.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      clearAuthCookies(res);

      return res.status(401).json({
        message: "Session expired. Please log in.",
      });
    }

    setAuthCookies(res, data.session);

    return res.status(200).json({
      message: "Session refreshed successfully.",
    });
  } catch (error) {
    console.error("Session refresh error:", error);

    return res.status(500).json({
      message: "Unable to refresh session.",
    });
  }
}
