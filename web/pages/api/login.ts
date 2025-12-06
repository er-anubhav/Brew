import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    console.error("Login API Error: BACKEND_URL is not defined");
    return res.status(500).json({ message: "Configuration Error: BACKEND_URL missing" });
  }

  try {
    console.log(`Login API: Connecting to ${backendUrl}/auth/login`);

    const backendRes = await fetch(backendUrl + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    // Read text first to debug non-JSON responses
    const responseText = await backendRes.text();
    console.log("Login API: Response status:", backendRes.status);
    // console.log("Login API: Response body:", responseText); // Uncomment if needed, careful with secrets

    let json;
    try {
      json = JSON.parse(responseText);
    } catch (e) {
      console.error("Login API Error: Failed to parse backend response as JSON", responseText);
      return res.status(backendRes.status || 500).json({
        message: "Backend Error: Invalid JSON response",
        details: responseText.slice(0, 100) // Return first 100 chars for debugging
      });
    }

    const token = json.data?.token || json.token;

    if (backendRes.ok && token) {
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
      if (json.data && json.data.token) delete json.data.token;
      if (json.token) delete json.token;
    }

    res.status(backendRes.status).json(json);
  } catch (err: any) {
    console.error("Login API Fatal Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
