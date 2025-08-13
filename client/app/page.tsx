"use client";
import { authClient } from "@/lib/auth-clients";
import { useState, useEffect } from "react";

export default function Home() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on component mount
  useEffect(() => {
    checkSession();

    // Check if we're returning from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code) {
      console.log("OAuth callback detected with code:", code);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Check session after a short delay to allow the callback to complete
      setTimeout(() => {
        checkSession();
      }, 1000);
    }

    if (error) {
      console.error("OAuth error:", error);
      setError(`OAuth error: ${error}`);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function checkSession() {
    try {
      const { data, error } = await authClient.getSession();
      if (error) {
        console.log("No active session:", error.message);
        return;
      }
      if (data) {
        // Set session information (from client)
        setSessionInfo(data);
        console.log("Session info from client:", data);

        // Get the access token from session.token
        if (data.session && data.session.token) {
          const accessToken = data.session.token;
          console.log("Using token from session:", accessToken);

          // Fetch JWT from auth server
          try {
            const tokenResponse = await fetch("http://localhost:3000/api/auth/token", {
              headers: {
                "Authorization": `Bearer ${accessToken}`
              },
            });

            if (!tokenResponse.ok) {
              throw new Error(`Failed to get JWT: ${tokenResponse.status}`);
            }

            const tokenData = await tokenResponse.json();
            console.log("JWT token received:", tokenData);

            if (tokenData.token) {
              // Fetch user information using the JWT
              await fetchUserInfo(tokenData.token);
            } else {
              setError("No JWT token received from auth server");
            }
          } catch (err) {
            console.error("Failed to get JWT from auth server:", err);
            setError("Failed to get JWT from auth server");
          }
        } else {
          console.log("No token found in session");
          setError("No access token available to fetch user info");
        }
      }
    } catch (err) {
      console.error("Error checking session:", err);
      setError("Failed to check session");
    }
  }

  async function fetchUserInfo(jwtToken: string) {
    try {
      const response = await fetch('http://localhost:3000/api/secure', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const userInfo = await response.json();
      console.log("User info from auth server:", userInfo);
      setUserInfo(userInfo);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching user info from auth server:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch user info from auth server");
      throw err;
    }
  }

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    setUserInfo(null);
    setSessionInfo(null);

    try {
      const { data, error } = await authClient.signIn.oauth2({
        providerId: "test", // matches the redirect URL configuration
      });

      if (error) {
        setError(error.message || "Sign in failed");
        return;
      }

      if (data && data.url) {
        console.log("Redirecting to:", data.url);
        // Redirect to the OAuth provider
        window.location.href = data.url;
      } else {
        setError("No redirect URL received");
      }
    } catch (err) {
      console.error("Error during sign in:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        setError(error.message || "Sign out failed");
        return;
      }
      setSessionInfo(null);
      setUserInfo(null);
      console.log("Signed out successfully");
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err instanceof Error ? err.message : "Sign out failed");
    }
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-white">OAuth Authentication Demo</h1>
      
      {sessionInfo ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-800 border border-green-600 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-green-100">✅ Authenticated</h2>
            <p className="text-green-200">Session active for user</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button 
          onClick={handleSignIn}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in..." : "Sign In with Generic OAuth"}
        </button>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-800 border border-red-600 text-red-100 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {userInfo && (
        <div className="mt-4 p-4 bg-green-800 border border-green-600 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-green-100">User Information (from Auth Server):</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-800 p-4 rounded border border-gray-600 text-gray-100 overflow-x-auto">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </div>
      )}

      {sessionInfo && (
        <div className="mt-4 p-4 bg-blue-800 border border-blue-600 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-blue-100">Session Information (from Client):</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-800 p-4 rounded border border-gray-600 text-gray-100 overflow-x-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
