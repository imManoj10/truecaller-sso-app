"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("truecallerProfile");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) {
    return <div className="p-6 text-center">No user found. Please login.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user.firstName} {user.lastName}
        </h1>
        <p className="text-gray-600 mb-2">📞 {user.phoneNumber}</p>
        {user.email && <p className="text-gray-600 mb-2">📧 {user.email}</p>}
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto mt-4 border"
          />
        )}
      </div>
    </div>
  );
}
