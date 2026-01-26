export default function Sidebar({ page, setPage, role, handleLogout }) {
  const go = (p) => {
    setPage(p)
    localStorage.setItem("page", p)
  }

  const base =
    "flex items-center gap-3 w-full text-left mb-2 px-4 py-2 rounded transition"

  const active =
    "bg-blue-600 text-white shadow"

  const inactive =
    "text-gray-300 hover:bg-gray-800 hover:text-blue-400"

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-5">

      {/* 🔹 TITLE */}
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-400">
        {role === "admin" ? "👨‍💼 Admin Portal" : "🎓 Student Portal"}
      </h2>

      {/* ================= STUDENT ================= */}
      {role === "student" && (
        <>
          <button
            onClick={() => go("home")}
            className={`${base} ${page === "home" ? active : inactive}`}
          >
            🏠 <span>Dashboard</span>
          </button>

          <button
            onClick={() => go("attendance")}
            className={`${base} ${page === "attendance" ? active : inactive}`}
          >
            📅 <span>Attendance</span>
          </button>

          <button
            onClick={() => go("events")}
            className={`${base} ${page === "events" ? active : inactive}`}
          >
            🎉 <span>Events</span>
          </button>

          <button
            onClick={() => go("marks")}
            className={`${base} ${page === "marks" ? active : inactive}`}
          >
            📊 <span>Marks</span>
          </button>

          <button
            onClick={() => go("report")}
            className={`${base} ${page === "report" ? active : inactive}`}
          >
            📝 <span>Report Card</span>
          </button>

          <button
            onClick={() => go("fees")}
            className={`${base} ${page === "fees" ? active : inactive}`}
          >
            💰 <span>Fees</span>
          </button>

          <button
            onClick={() => go("files")}
            className={`${base} ${page === "files" ? active : inactive}`}
          >
            📁 <span>Files</span>
          </button>
        </>
      )}

      {/* ================= ADMIN ================= */}
      {role === "admin" && (
        <>
          <button
            onClick={() => go("home")}
            className={`${base} ${page === "home" ? active : inactive}`}
          >
            🏠 <span>Dashboard</span>
          </button>

          <button
            onClick={() => go("uploadAttendance")}
            className={`${base} ${page === "uploadAttendance" ? active : inactive}`}
          >
            📅 <span>Upload Attendance</span>
          </button>

          <button
            onClick={() => go("uploadEvents")}
            className={`${base} ${page === "uploadEvents" ? active : inactive}`}
          >
            🎉 <span>Upload Events</span>
          </button>

          <button
            onClick={() => go("uploadMarks")}
            className={`${base} ${page === "uploadMarks" ? active : inactive}`}
          >
            📊 <span>Upload Marks</span>
          </button>

          <button
            onClick={() => go("uploadFees")}
            className={`${base} ${page === "uploadFees" ? active : inactive}`}
          >
            💰 <span>Upload Fees</span>
          </button>

          <button
            onClick={() => go("payFees")}
            className={`${base} ${page === "payFees" ? active : inactive}`}
          >
            💳 <span>Pay Fees</span>
          </button>

          <button
            onClick={() => go("uploadFiles")}
            className={`${base} ${page === "uploadFiles" ? active : inactive}`}
          >
            📁 <span>Upload Files</span>
          </button>
        </>
      )}

      {/* 🔹 FOOTER */}
      <hr className="my-6 border-gray-700" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full text-left px-4 py-2 rounded
                   text-red-400 hover:bg-gray-800 hover:text-red-500 transition"
      >
        🚪 <span>Logout</span>
      </button>
    </aside>
  )
}
