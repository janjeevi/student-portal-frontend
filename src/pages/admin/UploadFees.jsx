import { useEffect, useState } from "react";

export default function UploadFees() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [message, setMessage] = useState(""); // Added for success/error messages
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/classes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Classes fetch error", err);
        setClasses([]);
      });
  }, []); // Simplified: API is static

  const submit = async () => {
    if (!className || !totalFees || Number(totalFees) <= 0) {
      setMessage("Please select a class and enter a valid total fees amount.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/fees/class`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className,
          totalFees: Number(totalFees)
        })
      });

      if (!res.ok) {
        setMessage("Failed to upload fees. Please try again.");
        setMessageType("error");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setMessage("Fees uploaded successfully for the class!");
        setMessageType("success");
        setClassName("");
        setTotalFees("");
      } else {
        setMessage("Failed to upload fees. Please try again.");
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
    <div className="p-4 max-w-sm">
      <h2 className="text-xl font-bold mb-4">Upload Class Fees</h2>

      {message && (
        <p className={`mb-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <label htmlFor="class-select" className="block mb-2 font-medium">Select Class</label>
      <select
        id="class-select"
        className="border p-2 mb-3 w-full"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      <label htmlFor="total-fees" className="block mb-2 font-medium">Total Fees</label>
      <input
        id="total-fees"
        type="number"
        placeholder="Total Fees"
        className="border p-2 mb-4 w-full"
        value={totalFees}
        onChange={(e) => setTotalFees(e.target.value)}
        min="0"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Fees"}
      </button>
    </div>
  );
}