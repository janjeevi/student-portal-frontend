import { useEffect, useState } from "react"

export default function StudentReport() {
  const regNo = localStorage.getItem("regNo")
  const API = import.meta.env.VITE_API_URL

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/student/report?regNo=${regNo}`)
      .then(res => res.json())
      .then(data => {
        setReport(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [regNo])

  if (loading) return <p>Loading report...</p>
  if (!report) return <p>No report available</p>

  const { student, attendance, marks, fees } = report

  const monthly = marks.filter(m => m.examType === "Monthly")
  const quarterly = marks.filter(m => m.examType === "Quarterly")
  const halfYearly = marks.filter(m => m.examType === "Half-Yearly")
  const annual = marks.filter(m => m.examType === "Annual")

  const subjectOrder = ["Tamil", "English", "Maths", "Science", "Social"]

  const getGrade = (total) => {
    if (total >= 90) return { g: "A+", c: "bg-green-600" }
    if (total >= 75) return { g: "A", c: "bg-blue-600" }
    if (total >= 60) return { g: "B", c: "bg-yellow-500" }
    if (total >= 40) return { g: "C", c: "bg-orange-500" }
    return { g: "Fail", c: "bg-red-600" }
  }

  const renderMarksTable = (title, data) => {
    if (data.length === 0) return null

    const sorted = [...data].sort(
      (a, b) =>
        subjectOrder.indexOf(a.subject) -
        subjectOrder.indexOf(b.subject)
    )

    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">{title}</h3>

        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Internal</th>
              <th className="border p-2">Exam</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Grade</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((m, i) => {
              const grade = getGrade(m.total)
              return (
                <tr key={i} className="text-center">
                  <td className="border p-2 font-semibold">{m.subject}</td>
                  <td className="border p-2">{m.internal}</td>
                  <td className="border p-2">{m.exam}</td>
                  <td className="border p-2 font-bold">{m.total}</td>
                  <td className="border p-2">
                    <span
                      className={`text-white px-3 py-1 rounded text-sm ${grade.c}`}
                    >
                      {grade.g}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* 🔹 HEADER */}
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-3xl font-bold text-indigo-700">
          Student Report Card
        </h2>
      </div>

      {/* 🔹 STUDENT INFO */}
      <div className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Reg No:</strong> {student.regNo}</p>
        <p><strong>Class:</strong> {student.className}</p>
      </div>

      {/* 🔹 ATTENDANCE */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-3">Attendance</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-lg">
          <p>Total Days: <strong>{attendance.totalDays}</strong></p>
          <p>Present Days: <strong>{attendance.presentDays}</strong></p>
          <p>
            Percentage:
            <span className="ml-2 font-bold text-green-600">
              {attendance.percentage}%
            </span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded h-3 mt-4">
          <div
            className="bg-green-600 h-3 rounded"
            style={{ width: `${attendance.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* 🔹 MARKS */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Academic Performance</h3>

        {renderMarksTable("Monthly Exam", monthly)}
        {renderMarksTable("Quarterly Exam", quarterly)}
        {renderMarksTable("Half-Yearly Exam", halfYearly)}
        {renderMarksTable("Annual Exam", annual)}
      </div>

      {/* 🔹 FEES */}
      {fees && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-3">Fees Status</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg">
            <p>Total: ₹{fees.totalFees}</p>
            <p>Paid: ₹{fees.paidAmount}</p>
            <p>Balance: ₹{fees.balance}</p>
            <p className="font-bold">
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
          </div>
        </div>
      )}
       
     
    <div className="bg-white p-6 rounded shadow text-center print:hidden">
  <h2 className="text-3xl font-bold text-indigo-700">
    Student Report Card
  </h2>
<button
  onClick={() => window.print()}
  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
>
  ⬇️ Download Report (PDF)
</button>

  
</div>

    </div>
  )
}
