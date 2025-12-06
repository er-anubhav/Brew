import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const backendRes = await fetch(process.env.BACKEND_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const json = await backendRes.json();
    console.log("Login API: Received response from backend", backendRes.status);

    // Check if response is wrapped in { success: true, data: ... }
    const token = json.data?.token || json.token;

    if (backendRes.ok && token) {
      console.log("Login API: Setting cookie with token length:", token.length);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      );
      // Remove token from response body to avoid exposing it to client JS if needed, 
      // though sending it back is also fine if the client needs it for some reason.
      if (json.data && json.data.token) delete json.data.token;
      if (json.token) delete json.token;
    }
    res.status(backendRes.status).json(json);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}
