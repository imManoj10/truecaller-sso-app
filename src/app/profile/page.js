"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true); // New flag to delay render

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("payload");
    const signature = params.get("signature");

    const stored = localStorage.getItem("truecallerProfile");
    if (stored) {
      setUser(JSON.parse(stored));
      setChecking(false);
      return;
    }

    if (payload && signature) {
      fetch("/api/verify-truecaller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, signature }),
      })
        .then((res) => res.json())
        .then((userData) => {
          console.log("✅ Verified user from Truecaller:", userData);
          localStorage.setItem("truecallerProfile", JSON.stringify(userData));
          setUser(userData);
          window.history.replaceState({}, document.title, "/");
        })
        .catch((err) => {
          console.error("❌ Verification failed:", err);
          setError("Failed to verify Truecaller login.");
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
      if (!stored) setError("Please log in via Truecaller.");
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <h1 className="text-2xl mb-4">Truecaller Login Required</h1>
        <a
          href="/truecaller-login"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login with Truecaller
        </a>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, {user.firstName} {user.lastName}
        </h1>
        <p className="text-gray-600">📞 {user.phoneNumber}</p>
        {user.email && <p className="text-gray-600">📧 {user.email}</p>}
        <p className="text-sm text-gray-400 mt-4">(User ID: {user.id})</p>
        <button
          onClick={() => {
            localStorage.removeItem("truecallerProfile");
            window.location.href = "/";
          }}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
