import { useEffect, useState } from "react";

export default function StudentsList({ className }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!className) return;

    setLoading(true);
    setError(null);

    fetch(`${API}/students?className=${className}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Student fetch error", err);
        setError("Failed to load students.");
        setStudents([]);
        setLoading(false);
      });
  }, [className]); // Simplified: API is static

  if (!className) {
    return <p>Please select a class</p>;
  }

  if (loading) return <p>Loading students...</p>; // Loading indicator
  if (error) return <p className="text-red-500">{error}</p>; // Error display

  return (
    <div>
      <h3>Class {className}</h3>

      {students.length === 0 && <p>No students found</p>}

      <ul className="list-disc pl-5"> {/* Semantic list for accessibility */}
        {students.map((stu) => (
          <li key={stu.regNo || stu.id} className="mb-2"> {/* Better key, assuming regNo or fallback */}
            {stu.regNo} - {stu.name}
          </li>
        ))}
      </ul>
    </div>
  );
}