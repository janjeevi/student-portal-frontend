import { useEffect, useState } from "react";

export default function PayFees() {
  const [regNo, setRegNo] = useState("");
  const [amount, setAmount] = useState("");
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [message, setMessage] = useState(""); // Added for success/error messages
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const API = import.meta.env.VITE_API_URL;

  // 🔹 Load classes
  useEffect(() => {
    fetch(`${API}/classes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Class fetch error", err);
        setClasses([]);
      });
  }, []); // Simplified: API is static

  const payFees = async () => {
    if (!className || !regNo || !amount || Number(amount) <= 0) {
      setMessage("Select class, enter RegNo, and a valid amount.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/fees/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className,
          regNo,
          amount: Number(amount)
        })
      });

      if (!res.ok) {
        setMessage("Payment failed. Please try again.");
        setMessageType("error");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setMessage("Fees updated successfully!");
        setMessageType("success");
        setRegNo("");
        setAmount("");
        setClassName("");
      } else {
        setMessage("Error: Payment not processed.");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Pay Fees</h2>

      {message && (
        <p className={`mb-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      {/* CLASS SELECT */}
      <label htmlFor="class-select" className="block mb-2 font-medium">Select Class</label>
      <select
        id="class-select"
        className="border p-2 w-full mb-3"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      >
        <option value="">Select Class</option>
        <option value="ALL">ALL</option>
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      <label htmlFor="reg-no" className="block mb-2 font-medium">Register Number</label>
      <input
        id="reg-no"
        type="text"
        placeholder="Register Number"
        className="border p-2 w-full mb-3"
        value={regNo}
        onChange={(e) => setRegNo(e.target.value)}
      />

      <label htmlFor="amount" className="block mb-2 font-medium">Paid Amount</label>
      <input
        id="amount"
        type="number"
        placeholder="Paid Amount"
        className="border p-2 w-full mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
      />

      <button
        onClick={payFees}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Processing..." : "Submit Payment"}
      </button>
    </div>
  );
}