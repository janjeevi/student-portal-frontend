import { useEffect, useState, useRef } from "react";

export default function UploadFiles() {
  const [title, setTitle] = useState("");
  // "className" nnu podatha, "selectedClass" nnu podu
  const [selectedClass, setSelectedClass] = useState("");
  const [file, setFile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // File input ku ref create pannrom
  const fileInputRef = useRef(null);

  // const API =import.meta.env.VITE_API_URL || "http://localhost:10000";
// console.log("API:", import.meta.env.VITE_API_URL);
const API="https://student-portal-backend-q327.onrender.com"
  useEffect(() => {
    fetch(`${API}/classes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Class fetch error", err);
        setClasses([]);
      });
  }, []); // API constant dhaan, so empty array dhaan fine mostly.

  const handleUpload = async () => {
    if (!title || !selectedClass || !file) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("className", selectedClass); // Corrected variable name
      formData.append("file", file);

      console.log("📤 Uploading file:", file.name);

      const res = await fetch(`${API}/files/upload`, {
        method: "POST",
        body: formData
        // 'Content-Type' header podhatheenga!! Browser automat-a set pannum.
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error("Server returned an invalid response. Please try again.");
      }

      console.log("📥 Server response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      if (data.success) {
        setMessage("File uploaded successfully!");
        setMessageType("success");
        setTitle("");
        setSelectedClass(""); // Reset state
        setFile(null);
        
        // React style la file input clear pannurathu
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage("Upload failed: " + (data.error || "Unknown error."));
        setMessageType("error");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage("Upload error: " + err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-4">Upload File</h2>

      {message && (
        <p className={`mb-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <label htmlFor="title" className="block mb-2 font-medium">Title</label>
      <input
        id="title"
        className="border p-2 w-full mb-3"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="class-select" className="block mb-2 font-medium">Select Class</label>
      <select
        id="class-select"
        className="border p-2 w-full mb-3"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option value="">Select Class</option>
        <option value="ALL">ALL</option>
        {classes.map((cls) => (
          // cls na string nu assume pannirukom. Idhu object na, cls.name nu podanum.
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      <label htmlFor="file-upload" className="block mb-2 font-medium">Choose File</label>
      <input
        id="file-upload"
        type="file"
        className="mb-4"
        ref={fileInputRef} // Ref attach pannirukom
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.doc,.docx,.jpg,.png"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}