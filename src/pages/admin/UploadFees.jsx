import { useEffect, useState } from "react"

export default function UploadFees() {
  const [classes, setClasses] = useState([])
  const [className, setClassName] = useState("")
  const [totalFees, setTotalFees] = useState("")

  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetch(`${API}/classes`)
      .then(res => res.json())
      .then(data => setClasses(data))
  }, [])

  const submit = async () => {
    if (!className || !totalFees) {
      alert("Class & total fees required da")
      return
    }

    const res = await fetch(`${API}/fees/class`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        className,
        totalFees: Number(totalFees)
      })
    })

    const data = await res.json()

    if (data.success) {
      alert("✅ Fees uploaded for class")
      setClassName("")
      setTotalFees("")
    } else {
      alert("❌ Failed")
    }
  }

  return (
    <div className="p-4 max-w-sm">
      <h2 className="text-xl font-bold mb-4">Upload Class Fees</h2>

      <select
        className="border p-2 mb-3 w-full"
        value={className}
        onChange={e => setClassName(e.target.value)}
      >
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls} value={cls}>{cls}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Total Fees"
        className="border p-2 mb-4 w-full"
        value={totalFees}
        onChange={e => setTotalFees(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload Fees
      </button>
    </div>
  )
}
