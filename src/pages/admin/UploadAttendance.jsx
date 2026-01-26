import { useEffect, useState } from "react"

export default function UploadAttendance() {
  const API = import.meta.env.VITE_API_URL

  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})

  // 🔹 Load classes
  useEffect(() => {
    fetch(`${API}/classes`)
      .then(res => res.json())
      .then(data => setClasses(data))
      .catch(err => console.log("Class fetch error", err))
  }, [])

  // 🔹 Load students when class selected
  useEffect(() => {
    if (!selectedClass) return

    fetch(`${API}/students?className=${selectedClass}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data)

        const init = {}
        data.forEach(stu => {
          init[stu.regNo] = "present"
        })
        setAttendance(init)
      })
      .catch(err => console.log("Student fetch error", err))
  }, [selectedClass])

  // 🔹 Submit attendance
  const submitAttendance = async () => {
    const today = new Date().toISOString().slice(0, 10)

    const records = students.map(stu => ({
      regNo: stu.regNo,
      className: selectedClass,
      status: attendance[stu.regNo],
      date: today
    }))

    await fetch(`${API}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(records)
    })

    alert("✅ Attendance saved")
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">
        Upload Attendance
      </h2>

      {/* 🔹 CLASS SELECT */}
      {!selectedClass && (
        <div className="max-w-md">
          <label className="block mb-2 font-semibold">
            Select Class
          </label>

          <select
            className="border p-2 w-full rounded"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 🔹 STUDENTS TABLE */}
      {selectedClass && (
        <>
          <h3 className="text-xl font-semibold mt-6 mb-4">
            Class : {selectedClass}
          </h3>

          {students.length === 0 && (
            <p className="text-red-500">No students found</p>
          )}

          {students.length > 0 && (
            <table className="w-full bg-white border rounded shadow">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Reg No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map(stu => (
                  <tr key={stu.regNo} className="text-center">
                    <td className="border p-2">{stu.regNo}</td>
                    <td className="border p-2">{stu.name}</td>
                    <td className="border p-2">
                      <select
                        className="border p-1 rounded"
                        value={attendance[stu.regNo] || "present"}
                        onChange={e =>
                          setAttendance({
                            ...attendance,
                            [stu.regNo]: e.target.value
                          })
                        }
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={submitAttendance}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Submit Attendance
            </button>

            <button
              onClick={() => {
                setSelectedClass("")
                setStudents([])
                setAttendance({})
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded"
            >
              Back to Classes
            </button>
          </div>
        </>
      )}
    </div>
  )
}
