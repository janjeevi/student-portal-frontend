import { useEffect, useState } from "react"

export default function StudentAttendance() {
  const regNo = localStorage.getItem("regNo")
  const API = import.meta.env.VITE_API_URL

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/attendance/student?regNo=${regNo}`)
      .then(res => res.json())
      .then(data => {
        setRecords(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [regNo])

  if (loading) return <p>Loading attendance...</p>

  if (!records || records.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Attendance</h2>
        <p className="text-gray-500">No attendance records found</p>
      </div>
    )
  }

  const totalDays = records.length
  const presentDays = records.filter(
    r => r.status === "present"
  ).length
  const percentage = Math.round(
    (presentDays / totalDays) * 100
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* 🔹 HEADER */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">
          Attendance Overview
        </h2>
      </div>

      {/* 🔹 SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">Total Days</p>
          <p className="text-3xl font-bold">{totalDays}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">Present Days</p>
          <p className="text-3xl font-bold text-green-600">
            {presentDays}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">Attendance %</p>
          <p className="text-3xl font-bold text-blue-600">
            {percentage}%
          </p>
        </div>
      </div>

      {/* 🔹 PROGRESS BAR */}
      <div className="bg-white p-6 rounded shadow">
        <p className="font-semibold mb-2">
          Attendance Progress
        </p>
        <div className="w-full bg-gray-200 rounded h-3">
          <div
            className="bg-green-600 h-3 rounded"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* 🔹 DAILY ATTENDANCE TABLE */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4">
          Daily Attendance
        </h3>

        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="text-center">
                <td className="border p-2">
                  {new Date(r.date).toDateString()}
                </td>
                <td
                  className={`border p-2 font-bold ${
                    r.status === "present"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {r.status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
