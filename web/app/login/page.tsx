"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      router.push("/tasks");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <Image
          src="/auth-hero.png"
          alt="Premium Texture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" /> {/* Subtle overlay */}
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-primary mb-2">Welcome Back</h2>
            <p className="text-secondary font-body text-lg">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="peer w-full border-b-2 border-border py-2 text-primary placeholder-transparent focus:border-primary focus:outline-none transition-colors bg-transparent font-body text-lg"
                  placeholder="Email Address"
                  id="email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-sm text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:text-secondary peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary font-body"
                >
                  Email Address
                </label>
              </div>

              <div className="relative group">
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="peer w-full border-b-2 border-border py-2 text-primary placeholder-transparent focus:border-primary focus:outline-none transition-colors bg-transparent font-body text-lg"
                  placeholder="Password"
                  id="password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-sm text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:text-secondary peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary font-body"
                >
                  Password
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-none hover:bg-opacity-90 transition-all font-heading text-lg tracking-wide disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm text-center font-body border-l-4 border-red-500">
                {error}
              </div>
            )}
          </form>

          <p className="text-center lg:text-left text-secondary font-body">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
