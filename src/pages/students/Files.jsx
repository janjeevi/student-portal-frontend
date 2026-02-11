import { useEffect, useState } from "react"

export default function StudentFiles() {
  const regNo = localStorage.getItem("regNo")
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
const API = import.meta.env.VITE_API_URL

useEffect(() => {
  fetch(`${API}/files/student?regNo=${regNo}`)
    .then(res => res.json())
    .then(data => {
      setFiles(data)
      setLoading(false)
    })
    .catch(() => setLoading(false))
}, [regNo])



  if (loading) return <p>Loading files...</p>

  if (!files || files.length === 0) {
    return <p>No files uploaded yet</p>
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Study Materials</h2>

      <ul className="space-y-3">
        {files.map(f => (
          <li key={f._id} className="border p-3 rounded flex justify-between">
            <span>{f.title}</span>
            <a
              href={f.fileUrl}
              target="_blank"
              className="text-blue-600 font-semibold"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
