import { useEffect, useState } from "react"

export default function StudentFees() {
  const regNo = localStorage.getItem("regNo")
  const API = import.meta.env.VITE_API_URL

  const [fees, setFees] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/fees/student?regNo=${regNo}`)
      .then(res => res.json())
      .then(data => {
        setFees(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [regNo])

  if (loading) return <p>Loading fees...</p>

  if (!fees) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold">Fees</h2>
        <p className="text-gray-500 mt-2">
          No fees data available
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-2">
      <h2 className="text-2xl font-bold mb-4">Fees Details</h2>

      <p>Total Fees: ₹{fees.totalFees}</p>
      <p>Paid Amount: ₹{fees.paidAmount}</p>
      <p>Balance: ₹{fees.balance}</p>

      <p className="font-bold">
        Status:
        <span
          className={`ml-2 ${
            fees.status === "PAID"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {fees.status}
        </span>
      </p>
    </div>
  )
}
