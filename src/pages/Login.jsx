import { useState } from "react"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

 const API = import.meta.env.VITE_API_URL


 const handleLogin = async () => {
  setError("")

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })

  const data = await res.json()

  if (!data.success) {
    setError("Invalid username or password")
    return
  }

  localStorage.setItem("role", data.role)
  localStorage.setItem("page", "home")

  if (data.role === "student") {
    localStorage.setItem("regNo", data.regNo)
    localStorage.setItem("className", data.className)
    localStorage.setItem("name", data.name)
  }

  window.location.reload()
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl">

        {/* 🔹 TITLE */}
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Student Portal
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Login to continue
        </p>

        {/* 🔹 ERROR */}
        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        {/* 🔹 USERNAME */}
        <input
          type="text"
          placeholder="Register No / Username"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        {/* 🔹 PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {/* 🔹 BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition"
        >
          Login
        </button>

        {/* 🔹 FOOTER */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2026 Student Resource Portal
        </p>
      </div>
    </div>
  )
}
