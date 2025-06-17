"use client";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("truecallerProfile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No user data found. Please login first.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-green-200">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          👤 Truecaller Profile
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-green-400 shadow-md"
          />
          <p className="text-lg font-semibold text-gray-800">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-gray-600">Phone: {profile.phoneNumber}</p>
          <p className="text-sm text-gray-600">Email: {profile.email}</p>
          <p className="text-xs text-gray-500 mt-2">User ID: {profile.id}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
