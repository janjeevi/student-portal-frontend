import { useEffect, useState } from "react"

export default function StudentMarks() {
  const regNo = localStorage.getItem("regNo")
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)

  const API = import.meta.env.VITE_API_URL

  const subjectOrder = [
    "Tamil",
    "English",
    "Maths",
    "Science",
    "Social"
  ]

  // 🔹 Fetch marks
  useEffect(() => {
    fetch(`${API}/marks/student?regNo=${regNo}`)
      .then(res => res.json())
      .then(data => {
        setMarks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [regNo])

  // 🔹 Exam-wise split
  const monthly = marks.filter(m => m.examType === "Monthly")
  const quarterly = marks.filter(m => m.examType === "Quarterly")
  const halfYearly = marks.filter(m => m.examType === "Half-Yearly")
  const annual = marks.filter(m => m.examType === "Annual")

  // 🔹 Grade calc
  const getGrade = (total) => {
    if (total >= 90) return { g: "A+", c: "bg-green-600" }
    if (total >= 75) return { g: "A", c: "bg-blue-600" }
    if (total >= 60) return { g: "B", c: "bg-yellow-500" }
    if (total >= 40) return { g: "C", c: "bg-orange-500" }
    return { g: "Fail", c: "bg-red-600" }
  }

  // 🔹 Reusable table renderer
  const renderTable = (title, data) => {
    if (!data || data.length === 0) return null

    const sorted = [...data].sort(
      (a, b) =>
        subjectOrder.indexOf(a.subject) -
        subjectOrder.indexOf(b.subject)
    )

    return (
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-3">{title}</h3>

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
                  <td className="border p-2 font-semibold">
                    {m.subject}
                  </td>
                  <td className="border p-2">
                    {m.internal}
                  </td>
                  <td className="border p-2">
                    {m.exam}
                  </td>
                  <td className="border p-2 font-bold">
                    {m.total}
                  </td>
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

  if (loading) return <p>Loading marks...</p>
  if (!marks || marks.length === 0) return <p>No marks uploaded yet</p>

  return (
    <div className="bg-white p-6 rounded shadow max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">My Marks</h2>

      {renderTable("Monthly Exam", monthly)}
      {renderTable("Quarterly Exam", quarterly)}
      {renderTable("Half-Yearly Exam", halfYearly)}
      {renderTable("Annual Exam", annual)}
    </div>
  )
}
