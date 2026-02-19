import { useEffect, useState } from "react";

export default function UploadMarks() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [message, setMessage] = useState(""); // Added for success/error messages
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const subjects = ["Tamil", "English", "Maths", "Science", "Social"];
  const examTypes = ["Monthly", "Quarterly", "Half-Yearly", "Annual"];

  const API = import.meta.env.VITE_API_URL;

  // 🔹 Load classes
  useEffect(() => {
    fetch(`${API}/classes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Classes fetch error", err);
        setClasses([]);
      });
  }, []); // Simplified: API is static

  // 🔹 Load students by class
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
          init[stu.regNo] = { internal: "", exam: "" };
        });
        setMarks(init);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Student fetch error", err);
        setError("Failed to load students.");
        setStudents([]);
        setMarks({});
        setLoading(false);
      });
  }, [selectedClass]); // Simplified: API is static

  // 🔹 Submit marks
  const handleSubmit = async () => {
    if (!selectedClass || !subject || !examType) {
      setMessage("Please select class, subject, and exam type.");
      setMessageType("error");
      return;
    }

    if (students.length === 0) {
      setMessage("No students found.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    const records = students.map((stu) => {
      const internal = Math.max(0, Number(marks[stu.regNo]?.internal) || 0);
      const exam = Math.max(0, Number(marks[stu.regNo]?.exam) || 0);

      return {
        regNo: stu.regNo,
        name: stu.name,
        className: selectedClass,
        subject,
        examType,
        internal,
        exam
      };
    });

    try {
      const res = await fetch(`${API}/marks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(records)
      });

      if (!res.ok) {
        setMessage("Marks upload failed. Please try again.");
        setMessageType("error");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setMessage("Marks uploaded successfully!");
        setMessageType("success");
        setSelectedClass("");
        setSubject("");
        setExamType("");
        setStudents([]);
        setMarks({});
      } else {
        setMessage("Marks upload error. Please try again.");
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
    <div className="bg-white p-6 rounded shadow max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Upload Marks</h2>

      {message && (
        <p className={`mb-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

     {/* Select section */}
<div className="flex justify-between mb-8">

  <div className="flex flex-col w-[30%]">
    <label className="mb-2 font-semibold">Select Class</label>
    <select
      className="border p-2 rounded w-full"
      value={selectedClass}
      onChange={(e) => setSelectedClass(e.target.value)}
    >
      <option value="">Select Class</option>
      {classes.map((cls) => (
        <option key={cls} value={cls}>{cls}</option>
      ))}
    </select>
  </div>

  <div className="flex flex-col w-[30%]">
    <label className="mb-2 font-semibold">Select Subject</label>
    <select
      className="border p-2 rounded w-full"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
    >
      <option value="">Select Subject</option>
      {subjects.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>

  <div className="flex flex-col w-[30%]">
    <label className="mb-2 font-semibold">Select Exam Type</label>
    <select
      className="border p-2 rounded w-full"
      value={examType}
      onChange={(e) => setExamType(e.target.value)}
    >
      <option value="">Select Exam Type</option>
      {examTypes.map((e) => (
        <option key={e} value={e}>{e}</option>
      ))}
    </select>
  </div>

</div>


      {/* Students list */}
      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && students.length > 0 && (
        <>
          <div className="grid grid-cols-5 gap-4 font-bold border-b pb-2 mb-2" role="row">
            <span>Reg No</span>
            <span>Name</span>
            <span>Internal</span>
            <span>Exam</span>
            <span>Total</span>
          </div>

          {students.map((stu) => (
            <div key={stu.regNo} className="grid grid-cols-5 gap-4 mb-2" role="row">
              <span>{stu.regNo}</span>
              <span>{stu.name}</span>

              <input
                type="number"
                className="border p-1"
                value={marks[stu.regNo]?.internal ?? ""}
                onChange={(e) =>
                  setMarks({
                    ...marks,
                    [stu.regNo]: {
                      ...marks[stu.regNo],
                      internal: e.target.value
                    }
                  })
                }
                min="0"
                max="100"
                aria-label={`Internal marks for ${stu.name}`}
              />

              <input
                type="number"
                className="border p-1"
                value={marks[stu.regNo]?.exam ?? ""}
                onChange={(e) =>
                  setMarks({
                    ...marks,
                    [stu.regNo]: {
                      ...marks[stu.regNo],
                      exam: e.target.value
                    }
                  })
                }
                min="0"
                max="100"
                aria-label={`Exam marks for ${stu.name}`}
              />

              <strong>
                {(Number(marks[stu.regNo]?.internal) || 0) +
                 (Number(marks[stu.regNo]?.exam) || 0)}
              </strong>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 bg-green-600 text-white px-8 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Marks"}
          </button>
        </>
      )}
    </div>
  );
}