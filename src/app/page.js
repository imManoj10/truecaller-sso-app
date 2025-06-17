"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const App = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  // Trigger Truecaller login redirect (on Android)
  useEffect(() => {
    const nonce = Date.now().toString();
    const partnerKey = "Gss6fb6b29e47633c44a9961e8a8a39960058"; // 🔁 Replace this
    const partnerName = "Elbrit";    // 🔁 Replace this

    const truecallerUrl = `truecallersdk://truesdk/web_verify?requestNonce=${nonce}&partnerKey=${partnerKey}&partnerName=${partnerName}&ttl=180&lang=en`;

    if (/Android/i.test(navigator.userAgent)) {
      window.location.href = truecallerUrl;
    } else {
      setErrorMessage("Truecaller login works only on Android with the Truecaller app.");
    }
  }, []);

  // Handle Truecaller callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("payload");
    const signature = params.get("signature");

    if (payload && signature) {
      fetch("/api/verify-truecaller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, signature }),
      })
        .then((res) => res.json())
        .then((user) => {
          localStorage.setItem("truecallerProfile", JSON.stringify(user));
          router.push("/profile");
        })
        .catch((err) => {
          console.error("Truecaller login verification failed:", err);
          setErrorMessage("Verification failed. Please try again.");
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Truecaller SSO Login</h1>
        <p className="text-gray-600">Redirecting to Truecaller login...</p>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-6">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-1">{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
