"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("payload");
    const signature = params.get("signature");

    // If already stored, use it
    const stored = localStorage.getItem("truecallerProfile");
    if (stored) {
      setUser(JSON.parse(stored));
      return;
    }

    // If payload & signature are present, verify
    if (payload && signature) {
      fetch("/api/verify-truecaller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, signature }),
      })
        .then((res) => res.json())
        .then((userData) => {
          localStorage.setItem("truecallerProfile", JSON.stringify(userData));
          setUser(userData);
          // Remove payload/signature from URL for clean view
          router.replace("/profile");
        })
        .catch((err) => {
          console.error("Verification failed:", err);
          setError("Failed to verify Truecaller login.");
        });
    } else if (!stored) {
      setError("No Truecaller login data found.");
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
        Loading user data...
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
      </div>
    </div>
  );
}
