import { useEffect, useState } from "react"

export default function UploadEvents() {
  const [classes, setClasses] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [className, setClassName] = useState("")

  const API = import.meta.env.VITE_API_URL

  // Load classes
  useEffect(() => {
    fetch(`${API}/classes`)
      .then(res => res.json())
      .then(data => setClasses(data))
      .catch(err => console.error("Classes fetch error", err))
  }, [])

  const submitEvent = async () => {
    if (!title || !description || !date || !className) {
      alert("All fields required da")
      return
    }

    const res = await fetch(`${API}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        date,
        className
      })
    })

    const data = await res.json()

    if (data.success) {
      alert("✅ Event uploaded")
      setTitle("")
      setDescription("")
      setDate("")
      setClassName("")
    } else {
      alert("❌ Event upload failed")
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-2xl font-bold mb-4">Upload Event</h2>

      <input
        placeholder="Event Title"
        className="border p-2 w-full mb-3"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Event Description"
        className="border p-2 w-full mb-3"
        rows="3"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 w-full mb-3"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      {/* ✅ ONE SELECT ONLY */}
      <select
        className="border p-2 w-full mb-4"
        value={className}
        onChange={e => setClassName(e.target.value)}
      >
        <option value="">Select Class</option>
        <option value="ALL">ALL</option>
        {classes.map(cls => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      <button
        onClick={submitEvent}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        Upload Event
      </button>
    </div>
  )
}
