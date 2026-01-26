import { useEffect, useState } from "react"

export default function UploadFiles() {
  const [title, setTitle] = useState("")
  const [className, setClassName] = useState("")
  const [file, setFile] = useState(null)
  const [classes, setClasses] = useState([])
const API = import.meta.env.VITE_API_URL



  // 🔹 load classes
  useEffect(() => {
    fetch(`${API}/classes`)
      .then(res => res.json())
      .then(data => setClasses(data))
  }, [])

  const handleUpload = async () => {
    if (!file || !title || !className) {
      alert("All fields required")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("className", className)
    formData.append("file", file)

  const res = await fetch(`${API}/files/upload`, {
  method: "POST",
  body: formData
})
const data = await res.json()

    if (data.success) alert("✅ File uploaded")
    else alert("❌ Upload failed")
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-4">Upload File</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-3"
        value={className}
        onChange={e => setClassName(e.target.value)}
      >
        <option value="">Select Class</option>
        <option value="ALL">ALL</option>
        {classes.map(cls => (
          <option key={cls} value={cls}>{cls}</option>
        ))}
      </select>

      <input
        type="file"
        className="mb-4"
        onChange={e => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Upload
      </button>
    </div>
  )
}
