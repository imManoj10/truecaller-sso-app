"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [queryParams, setQueryParams] = useState({}); // For debugging

  useEffect(() => {
    // ✅ Get query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("payload");
    const signature = params.get("signature");

    // Store them in state just to show/debug
    setQueryParams({ payload, signature });

    if (payload && signature) {
      // ✅ Send to backend to verify
      fetch("/api/verify-truecaller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, signature }),
      })
        .then((res) => res.json())
        .then((userData) => {
          console.log("✅ Verified Truecaller user:", userData); // ✅ Show in console
          setUser(userData); // ✅ Store in state for UI
        })
        .catch((err) => {
          console.error("❌ Verification error:", err);
          setError("Failed to verify user.");
        });
    } else {
      setError("Missing payload or signature in URL.");
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>Loading user data...</p>
          <pre className="text-xs text-gray-400 mt-4">
            Query Params: {JSON.stringify(queryParams, null, 2)}
          </pre>
        </div>
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

        <div className="text-left text-xs text-gray-500 mt-6">
          <h3 className="font-semibold mb-1">Raw Query Parameters:</h3>
          <pre className="break-words">{JSON.stringify(queryParams, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
