import { useEffect, useState } from "react"

export default function StudentDashboard() {
  const regNo = localStorage.getItem("regNo")
  const name = localStorage.getItem("name")
  const className = localStorage.getItem("className")
  const API = import.meta.env.VITE_API_URL

  const [attendance, setAttendance] = useState(null)
  const [marks, setMarks] = useState([])
  const [fees, setFees] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/attendance/student?regNo=${regNo}`).then(r => r.json()),
      fetch(`${API}/marks/student?regNo=${regNo}`).then(r => r.json()),
      fetch(`${API}/fees/student?regNo=${regNo}`).then(r => r.json()),
      fetch(`${API}/events?className=${className}`).then(r => r.json())
    ]).then(([att, marksData, feesData, eventsData]) => {
      const totalDays = att.length
      const presentDays = att.filter(a => a.status === "present").length
      const percentage =
        totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100)

      setAttendance({ totalDays, presentDays, percentage })
      setMarks(marksData)
      setFees(feesData)
      setEvents(eventsData)
      setLoading(false)
    })
  }, [regNo, className])

  if (loading) return <p>Loading dashboard...</p>

  return (
    <div className="space-y-6">

      {/* WELCOME */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">
          Welcome, {name} 👋
        </h1>
        <p className="text-gray-600">
          Reg No: {regNo} | Class: {className}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-blue-50 p-5 rounded shadow">
          <h3 className="font-semibold mb-2">Attendance</h3>
          <p className="text-3xl font-bold text-blue-600">
            {attendance.percentage}%
          </p>
          <p className="text-sm text-gray-600">
            {attendance.presentDays}/{attendance.totalDays} days
          </p>
        </div>

        <div className="bg-green-50 p-5 rounded shadow">
          <h3 className="font-semibold mb-2">Exams</h3>
          <p className="text-3xl font-bold text-green-600">
            {marks.length}
          </p>
          <p className="text-sm text-gray-600">
            Records uploaded
          </p>
        </div>

        <div className="bg-yellow-50 p-5 rounded shadow">
          <h3 className="font-semibold mb-2">Fees</h3>
          <p
            className={`text-xl font-bold ${
              fees?.status === "PAID"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {fees ? fees.status : "Not Uploaded"}
          </p>
          {fees && (
            <p className="text-sm text-gray-600">
              Balance ₹{fees.balance}
            </p>
          )}
        </div>

      </div>

      {/* LATEST EVENT */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Latest Event</h2>

        {events.length === 0 ? (
          <p className="text-gray-500">No events available</p>
        ) : (
          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-semibold">{events[0].title}</h3>
            <p className="text-gray-600">
              {events[0].description}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(events[0].date).toDateString()}
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
