import { useEffect, useState } from "react";

export default function UploadAttendance() {
  const API = import.meta.env.VITE_API_URL;

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [message, setMessage] = useState(""); // Added for success/error messages
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

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

  // 🔹 Load students when class selected
  useEffect(() => {
    if (!selectedClass) return;

    setLoading(true);
    setError(null);

    fetch(`${API}/students?className=${selectedClass}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setStudents(list);

        const init = {};
        list.forEach((stu) => {
          init[stu.regNo] = "present";
        });
        setAttendance(init);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Student fetch error", err);
        setError("Failed to load students.");
        setStudents([]);
        setAttendance({});
        setLoading(false);
      });
  }, [selectedClass]); // Simplified: API is static

  // 🔹 Submit attendance
  const submitAttendance = async () => {
    if (students.length === 0) {
      setMessage("No students to submit.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    const today = new Date().toISOString().slice(0, 10);

    const records = students.map((stu) => ({
      regNo: stu.regNo,
      className: selectedClass,
      status: attendance[stu.regNo] || "present",
      date: today
    }));

    try {
      const res = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(records)
      });

      if (!res.ok) {
        setMessage("Attendance save failed. Please try again.");
        setMessageType("error");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setMessage("Attendance saved successfully!");
        setMessageType("success");
        setSelectedClass("");
        setStudents([]);
        setAttendance({});
      } else {
        setMessage("Attendance error. Please try again.");
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

  const resetSelection = () => {
    setSelectedClass("");
    setStudents([]);
    setAttendance({});
    setError(null);
    setMessage("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Upload Attendance</h2>

      {message && (
        <p className={`mb-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      {/* CLASS SELECT */}
      {!selectedClass && (
        <div className="max-w-md">
          <label htmlFor="class-select" className="block mb-2 font-semibold">
            Select Class
          </label>
          <select
            id="class-select"
            className="border p-2 w-full rounded"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* STUDENTS TABLE */}
      {selectedClass && (
        <>
          <h3 className="text-xl font-semibold mt-6 mb-4">
            Class: {selectedClass}
          </h3>

          {loading && <p>Loading students...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && students.length === 0 && (
            <p className="text-red-500">No students found</p>
          )}

          {!loading && !error && students.length > 0 && (
            <table className="w-full bg-white border rounded shadow" role="table" aria-label="Student Attendance">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2" scope="col">Reg No</th>
                  <th className="border p-2" scope="col">Name</th>
                  <th className="border p-2" scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.regNo} className="text-center">
                    <td className="border p-2">{stu.regNo}</td>
                    <td className="border p-2">{stu.name}</td>
                    <td className="border p-2">
                      <select
                        className="border p-1 rounded"
                        value={attendance[stu.regNo] || "present"}
                        onChange={(e) =>
                          setAttendance({
                            ...attendance,
                            [stu.regNo]: e.target.value
                          })
                        }
                        aria-label={`Attendance for ${stu.name}`}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={submitAttendance}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Attendance"}
            </button>
            <button
              onClick={resetSelection}
              className="bg-gray-500 text-white px-6 py-2 rounded"
            >
              Back to Classes
            </button>
          </div>
        </>
      )}
    </div>
  );
}