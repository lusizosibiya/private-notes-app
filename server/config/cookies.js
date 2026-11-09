export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export function setAuthCookies(res, session) {
  res.cookie("access_token", session.access_token, {
    ...cookieOptions,
    maxAge: session.expires_in * 1000,
  });

  res.cookie("refresh_token", session.refresh_token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res) {
  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);
}
