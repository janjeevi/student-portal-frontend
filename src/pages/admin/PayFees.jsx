import { useEffect, useState } from "react"

export default function PayFees() {
  const [regNo, setRegNo] = useState("")
  const [amount, setAmount] = useState("")
  const [classes, setClasses] = useState([])
  const [className, setClassName] = useState("")

  const API = import.meta.env.VITE_API_URL

  // 🔹 Load classes
  useEffect(() => {
    fetch(`${API}/classes`)
      .then(res => res.json())
      .then(data => setClasses(data))
  }, [])

  // 🔹 REPLACED payFees function
  const payFees = async () => {
    if (!className || !regNo || !amount) {
      alert("Select class, RegNo & amount")
      return
    }

    const res = await fetch(`${API}/fees/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        className,
        regNo,
        amount: Number(amount)
      })
    })

    const data = await res.json()

    if (data.success) {
      alert("Fees updated ✅")
      setRegNo("")
      setAmount("")
    } else {
      alert("Error ❌")
    }
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Pay Fees</h2>

      {/* 🔹 CLASS SELECT */}
      <select
        className="border p-2 w-full mb-3"
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

      <input
        type="text"
        placeholder="Register Number"
        className="border p-2 w-full mb-3"
        value={regNo}
        onChange={e => setRegNo(e.target.value)}
      />

      <input
        type="number"
        placeholder="Paid Amount"
        className="border p-2 w-full mb-4"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <button
        onClick={payFees}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Submit Payment
      </button>
    </div>
  )
}
