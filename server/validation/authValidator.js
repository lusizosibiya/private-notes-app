import { supabase } from "../config/supabase.js";

export async function authValidator(req, res, next) {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated. Please log in.",
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        message: "Invalid or expired session.",
      });
    }

    req.user = data.user;
    req.accessToken = token;

    next();
  } catch (error) {
    console.error("Authentication validation error:", error);

    return res.status(500).json({
      message: "Unable to validate authentication.",
    });
  }
}
