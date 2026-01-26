
import { useEffect, useState } from "react"

export default function AdminHome() {
  const API = import.meta.env.VITE_API_URL

  const [counts, setCounts] = useState({
    students: 0,
    classes: 0,
    events: 0,
    files: 0
  })

  useEffect(() => {
    Promise.all([
      fetch(`${API}/students?className=`).then(r => r.json()).catch(() => []),
      fetch(`${API}/classes`).then(r => r.json()).catch(() => []),
      fetch(`${API}/events?className=ALL`).then(r => r.json()).catch(() => []),
      fetch(`${API}/files/student?regNo=ADMIN`).then(r => r.json()).catch(() => [])
    ]).then(([students, classes, events, files]) => {
      setCounts({
        students: students.length || 0,
        classes: classes.length || 0,
        events: events.length || 0,
        files: files.length || 0
      })
    })
  }, [])

  const card = (title, value, color, icon) => (
    <div className="bg-white p-6 rounded shadow flex items-center gap-4">
      <div className={`text-3xl ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-indigo-700">
          Welcome, Admin 👨‍💼
        </h1>
        <p className="text-gray-500">
          Manage students, academics & resources
        </p>
      </div>

      {/* STATS */}
      

    </div>
  )
}
