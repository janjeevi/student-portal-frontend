import { useEffect, useState } from "react"

export default function StudentHome() {
  const name = localStorage.getItem("name") || "Student"
  const regNo = localStorage.getItem("regNo")
  const className = localStorage.getItem("className")

  const API = import.meta.env.VITE_API_URL

  const [attendance, setAttendance] = useState(null)
  const [fees, setFees] = useState(null)
  const [marks, setMarks] = useState([])

  useEffect(() => {
    // Attendance
    fetch(`${API}/attendance/student?regNo=${regNo}`)
      .then(res => res.json())
      .then(data => {
        const total = data.length
        const present = data.filter(a => a.status === "present").length
        const percent =
          total === 0 ? 0 : Math.round((present / total) * 100)

        setAttendance({ total, present, percent })
      })

    // Fees
    fetch(`${API}/fees/student?regNo=${regNo}`)
      .then(res => res.json())
      .then(setFees)

    // Marks
    fetch(`${API}/marks/student?regNo=${regNo}`)
      .then(res => res.json())
      .then(setMarks)
  }, [regNo])

  return (
    <div className="flex justify-center">
      {/* MAIN CONTENT WRAPPER */}
      <div className="w-full max-w-6xl space-y-8">

        {/* 🔹 WELCOME CARD */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {name} 👋
          </h1>
          <p className="text-lg">
            Reg No: <strong>{regNo}</strong>
          </p>
          <p className="text-lg">
            Class: <strong>{className}</strong>
          </p>
        </div>

        {/* 🔹 DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ATTENDANCE */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-2">
              Attendance
            </h3>

            {attendance ? (
              <>
                <p>Total Days: {attendance.total}</p>
                <p>Present: {attendance.present}</p>
                <p className="font-bold mt-2">
                  {attendance.percent}%
                </p>

                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className="bg-green-600 h-2 rounded"
                    style={{ width: `${attendance.percent}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                No attendance data
              </p>
            )}
          </div>

          {/* MARKS */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-2">
              Marks
            </h3>

            <p>
              Exams Uploaded:
              <strong className="ml-2">
                {marks.length}
              </strong>
            </p>

            <p className="text-gray-500 mt-2">
              Check Marks section for details
            </p>
          </div>

          {/* FEES */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-2">
              Fees
            </h3>

            {fees ? (
              <>
                <p>Total: ₹{fees.totalFees}</p>
                <p>Paid: ₹{fees.paidAmount}</p>
                <p className="font-bold mt-2">
                  Status:
                  <span
                    className={`ml-2 ${
                      fees.status === "PAID"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {fees.status}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-500">
                Fees not uploaded yet
              </p>
            )}
          </div>

        </div>

        {/* 🔹 INFO */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">
            Student Dashboard
          </h3>
          <p className="text-gray-600">
            Use the sidebar to navigate attendance, marks,
            events, fees and study materials.
          </p>
        </div>

      </div>
    </div>
  )
}
