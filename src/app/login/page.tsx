"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      if (data.success) {
        window.location.href = "/admin";
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Logo */}
      <div className="absolute left-8 top-7 md:left-16 md:top-14">
        <Link href="/">
          <div className="relative h-[32px] w-[125px]">
            <Image
              src="/PIZZTOL.png"
              alt="Pizztol"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>
      </div>

      {/* Login */}
      <div className="flex min-h-screen items-center justify-center px-5 py-24">
        <div className="w-full max-w-[380px] bg-white px-8 py-8 shadow-[0_4px_18px_rgba(0,0,0,0.10)]">
          <div className="text-center">
            <h1 className="font-heading text-[24px] font-bold leading-[30px] text-black">
              Sign in with email
            </h1>

            <p className="mx-auto mt-3 max-w-[290px] text-[14px] leading-[21px] tracking-[0.05em] text-black">
              Enter your email address and password to access the admin
              dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="h-[50px] w-full border border-[#d5d5d5] px-4 text-[14px] outline-none focus:border-black"
            />

            {/* Password */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              className="mt-6 h-[50px] w-full border border-[#d5d5d5] px-4 text-[14px] outline-none focus:border-black"
            />

            {/* Error */}
            {error && (
              <p className="mt-4 text-center text-[13px] font-medium text-[#c90000]">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 h-[50px] w-full bg-black text-[15px] font-semibold text-white transition hover:bg-[#c90000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* Remember / Forgot */}
            <div className="mt-6 flex items-center justify-between">
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="h-4 w-4"
                />

                <span>Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-[14px] hover:opacity-50"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}