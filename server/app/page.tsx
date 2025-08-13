"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    console.log(username, password);

    const { data, error } = await authClient.signUp.email({
      email, 
      password, 
      name
      })

    if (error) {
      alert(error.message);
    }

    if (data) {
      alert("User registered successfully");
      console.log(data);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log(email, password);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }

    if (data) {
      alert("User logged in successfully");
      console.log(data);
    }
  }

  async function handleLogout() {
    const { error, data } = await authClient.signOut();
    if (error) {
      alert(error.message);
    }
    if (data) {
      alert("User logged out successfully");
      console.log(data);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Authentication Server</h1>
          <p className="text-gray-600">Sign up or sign in to your account</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Register
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Login
            </button>
          </form>
        </div>

        <div className="text-center">
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
