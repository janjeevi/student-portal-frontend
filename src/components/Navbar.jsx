export default function Navbar({ role, onLogout }) {
  return (
    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        Student Resource Portal
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm opacity-80">
          {role === "admin" ? "Admin / Faculty" : "Student"}
        </span>

        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
