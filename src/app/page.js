"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const App = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const simulateTruecallerSDK = () => {
    // Mocking window.TruecallerAuth with a fake login response
    window.TruecallerAuth = {
      _isInitialized: true,
      requestVerification: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ message: "Simulated success" });
          }, 1000);
        });
      },
    };
    console.log("✅ Simulated Truecaller SDK loaded.");
  };

  useEffect(() => {
    simulateTruecallerSDK(); // Simulate SDK on mount
  }, []);

  const handleTruecallerLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    setUserProfile(null);

    if (!window.TruecallerAuth || !window.TruecallerAuth._isInitialized) {
      setErrorMessage("Truecaller SDK is not loaded or initialized. Please try refreshing the page.");
      setLoading(false);
      return;
    }

    try {
      const response = await window.TruecallerAuth.requestVerification();
      console.log("Truecaller verification simulated:", response);

      await new Promise(resolve => setTimeout(resolve, 2000)); // simulate delay

      const mockUserProfile = {
        id: 'dummy_tc_user_123',
        phoneNumber: '+919999999999',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo.user@mockmail.com',
        profilePicture: 'https://placehold.co/100x100/9FC3FF/202020?text=DU',
      };
      localStorage.setItem("truecallerProfile", JSON.stringify(mockUserProfile));
      setLoading(false);
      router.push("/profile");

    } catch (error) {
      console.error('Truecaller login simulation failed:', error);
      setErrorMessage(`Login failed: ${error.message || 'An unknown error occurred.'}`);
      setIsLoggedIn(false);
      setUserProfile(null);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setErrorMessage('');
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Truecaller SSO Login (Demo)
        </h1>

        {!isLoggedIn ? (
          <div className="space-y-6">
            <p className="text-center text-gray-600">
              Click the button below to simulate Truecaller login.
            </p>
            <button
              onClick={handleTruecallerLogin}
              disabled={loading}
              className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out
                ${loading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Initiating login...
                </>
              ) : (
                <>
                  <img
                    src="https://truecaller.github.io/truesdk-web-docs/truecaller_icon.svg"
                    alt="Truecaller Icon"
                    className="h-5 w-5 mr-3"
                  />
                  Login with Truecaller
                </>
              )}
            </button>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-4 text-center" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{errorMessage}</span>
                <button
                  onClick={handleRefreshPage}
                  className="mt-2 block w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Login Successful!</h2>
            {userProfile && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex flex-col items-center space-y-4">
                {userProfile.profilePicture && (
                  <img
                    src={userProfile.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-green-400 shadow-md"
                  />
                )}
                <p className="text-lg font-medium text-gray-800">
                  Welcome, {userProfile.firstName} {userProfile.lastName}!
                </p>
                <p className="text-gray-600 text-sm">
                  Phone: {userProfile.phoneNumber}
                </p>
                {userProfile.email && (
                  <p className="text-gray-600 text-sm">
                    Email: {userProfile.email}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  (User ID: {userProfile.id})
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="mt-6 w-full px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
