'use client';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("payload");
    const signature = params.get("signature");

    if (!payload || !signature) {
      setError("Missing payload or signature in URL");
      return;
    }

    fetch("/api/verify-truecaller", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, signature }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          console.log("✅ Truecaller User:", data.user); // 👈 LOG HERE
        } else {
          setError(data.error || "Verification failed");
        }
      })
      .catch((err) => {
        console.error("❌ Error verifying Truecaller:", err);
        setError("Something went wrong");
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Truecaller Profile</h2>
      {error && <p className="text-red-600">{error}</p>}
      {user && (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Country Code:</strong> {user.countryCode}</p>
        </>
      )}
    </div>
  );
}
