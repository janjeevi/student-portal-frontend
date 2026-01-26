import { useEffect, useState } from "react"

export default function StudentEvents() {
  const className = localStorage.getItem("className")
  const API = import.meta.env.VITE_API_URL

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/events?className=${className}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [className])

  if (loading) return <p>Loading events...</p>

  if (events.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold">Events</h2>
        <p className="text-gray-500 mt-2">No events available</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">Events</h2>

      {events.map((e, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded shadow border-l-4 border-blue-600"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{e.title}</h3>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
              {e.className}
            </span>
          </div>

          <p className="text-gray-700">{e.description}</p>

          <p className="text-sm text-gray-500 mt-2">
            📅 {new Date(e.date).toDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}
