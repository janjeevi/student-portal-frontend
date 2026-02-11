import { useEffect, useState } from "react";

export default function AdminHome() {
  const API = import.meta.env.VITE_API_URL;

  const [counts, setCounts] = useState({
    students: 0,
    classes: 0,
    events: 0,
    files: 0
  });
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const safeFetch = (url) =>
      fetch(url)
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => []);

    setLoading(true);
    setError(null);

    Promise.all([
      safeFetch(`${API}/students?className=`),
      safeFetch(`${API}/classes`),
      safeFetch(`${API}/events?className=ALL`),
      safeFetch(`${API}/files/student?regNo=ADMIN`)
    ])
      .then(([students, classes, events, files]) => {
        setCounts({
          students: Array.isArray(students) ? students.length : 0,
          classes: Array.isArray(classes) ? classes.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          files: Array.isArray(files) ? files.length : 0
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load stats. Please try again.");
        setLoading(false);
      });
  }, []); // Simplified: API is static, no need for dependency

  const card = (title, value, color, icon) => (
    <div className="bg-white p-6 rounded shadow flex items-center gap-4" role="region" aria-labelledby={`${title}-label`}>
      <div className={`text-3xl ${color}`} aria-hidden="true">{icon}</div>
      <div>
        <p className="text-gray-500" id={`${title}-label`}>{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (loading) return <p>Loading stats...</p>; // Loading indicator
  if (error) return <p className="text-red-500">{error}</p>; // Error display

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-indigo-700">
          Welcome, Admin 👨‍💼
        </h1>
        <p className="text-gray-500">
          Manage students, academics & resources
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {card("Students", counts.students, "text-blue-600", "🎓")}
        {card("Classes", counts.classes, "text-green-600", "🏫")}
        {card("Events", counts.events, "text-purple-600", "📅")}
        {card("Files", counts.files, "text-orange-600", "📁")}
      </div>
    </div>
  );
}