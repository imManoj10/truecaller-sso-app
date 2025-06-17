"use client";
import React, { useEffect, useState } from "react";

export default function TruecallerLoginPage() {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const nonce = Date.now().toString();
    const partnerKey = "Gss6fb6b29e47633c44a9961e8a8a39960058";
    const partnerName = "Elbrit";
    const sdkUrl = `truecallersdk://truesdk/web_verify?requestNonce=${nonce}&partnerKey=${partnerKey}&partnerName=${partnerName}&ttl=180&lang=en`;

    if (/Android/i.test(navigator.userAgent)) {
      const link = document.createElement("a");
      link.href = sdkUrl;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setErrorMessage("Truecaller login only works on Android with the Truecaller app installed.");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-xl font-bold mb-2">Truecaller Login</h2>
        <p className="text-gray-600">Redirecting to Truecaller app...</p>
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
}
