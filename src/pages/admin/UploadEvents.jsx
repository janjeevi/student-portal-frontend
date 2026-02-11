import { useEffect, useState } from "react";

export default function UploadEvents() {
  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [message, setMessage] = useState(""); // Added for success/error messages
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const API = import.meta.env.VITE_API_URL;

  // Load classes
  useEffect(() => {
    fetch(`${API}/classes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Classes fetch error", err);
        setClasses([]);
      });
  }, []); // Simplified: API is static

  const submitEvent = async () => {
    if (!title || !description || !date || !className) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          className
        })
      });

      if (!res.ok) {
        setMessage("Event upload failed. Please try again.");
        setMessageType("error");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setMessage("Event uploaded successfully!");
        setMessageType("success");
        setTitle("");
        setDescription("");
        setDate("");
        setClassName("");
      } else {
        setMessage("Event upload failed. Please try again.");
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
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-2xl font-bold mb-4">Upload Event</h2>

      {message && (
        <p className={`mb-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <label htmlFor="title" className="block mb-2 font-medium">Event Title</label>
      <input
        id="title"
        placeholder="Event Title"
        className="border p-2 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="description" className="block mb-2 font-medium">Event Description</label>
      <textarea
        id="description"
        placeholder="Event Description"
        className="border p-2 w-full mb-3"
        rows="3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="date" className="block mb-2 font-medium">Event Date</label>
      <input
        id="date"
        type="date"
        className="border p-2 w-full mb-3"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label htmlFor="class-select" className="block mb-2 font-medium">Select Class</label>
      <select
        id="class-select"
        className="border p-2 w-full mb-4"
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

      <button
        onClick={submitEvent}
        disabled={loading}
        className="bg-blue-600 text-white w-full py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Event"}
      </button>
    </div>
  );
}