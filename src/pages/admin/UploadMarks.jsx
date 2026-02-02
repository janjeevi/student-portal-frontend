import { useEffect, useState } from "react"

export default function UploadMarks() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [subject, setSubject] = useState("")
  const [examType, setExamType] = useState("")
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})

  const subjects = ["Tamil", "English", "Maths", "Science", "Social"]
  const examTypes = ["Monthly", "Quarterly", "Half-Yearly", "Annual"]
const API = import.meta.env.VITE_API_URL

  // 🔹 Load classes
  useEffect(() => {
    fetch(`${API}/classes`)
      .then(res => res.json())
      .then(data => setClasses(data))
  }, [])

  // 🔹 Load students by class
  useEffect(() => {
    if (!selectedClass) return

    fetch(`${API}/students?className=${selectedClass}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data)
        const init = {}
        data.forEach(stu => {
          init[stu.regNo] = { internal: "", exam: "" }
        })
        setMarks(init)
      })
  }, [selectedClass])

  // 🔹 Submit marks
  const handleSubmit = async () => {
    if (!selectedClass || !subject || !examType) {
      alert("Select class, subject & exam type")
      return
    }

    const records = students.map(stu => {
      const internal = Number(marks[stu.regNo].internal) || 0
      const exam = Number(marks[stu.regNo].exam) || 0

      return {
        regNo: stu.regNo,
        name: stu.name,
        className: selectedClass,
        subject,
        examType,
        internal,
        exam
      }
    })

    await fetch(`${API}/marks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(records)
    })

    alert("✅ Marks Uploaded Successfully")
    setSelectedClass("")
    setStudents([])
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Upload Marks</h2>

      {/* 🔹 Select section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <select
          className="border p-2"
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <select
          className="border p-2"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="border p-2"
          value={examType}
          onChange={e => setExamType(e.target.value)}
        >
          <option value="">Select Exam Type</option>
          {examTypes.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* 🔹 Students list */}
      {students.length > 0 && (
        <>
          <div className="grid grid-cols-5 gap-4 font-bold border-b pb-2 mb-2">
            <span>Reg No</span>
            <span>Name</span>
            <span>Internal</span>
            <span>Exam</span>
            <span>Total</span>
          </div>

          {students.map(stu => (
            <div key={stu.regNo} className="grid grid-cols-5 gap-4 mb-2">
              <span>{stu.regNo}</span>
              <span>{stu.name}</span>

              <input
                type="number"
                className="border p-1"
                value={marks[stu.regNo]?.internal}
                onChange={e =>
                  setMarks({
                    ...marks,
                    [stu.regNo]: {
                      ...marks[stu.regNo],
                      internal: e.target.value
                    }
                  })
                }
              />

              <input
                type="number"
                className="border p-1"
                value={marks[stu.regNo]?.exam}
                onChange={e =>
                  setMarks({
                    ...marks,
                    [stu.regNo]: {
                      ...marks[stu.regNo],
                      exam: e.target.value
                    }
                  })
                }
              />

              <strong>
                {(Number(marks[stu.regNo]?.internal) || 0) +
                 (Number(marks[stu.regNo]?.exam) || 0)}
              </strong>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="mt-6 bg-green-600 text-white px-8 py-2 rounded"
          >
            Submit Marks
          </button>
        </>
      )}
    </div>
  )
}
