import { useEffect, useState } from "react";

export default function ChooseClass({ onSelect }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state for user feedback
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/classes`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch classes");
        return res.json();
      })
      .then((data) => {
        console.log("Classes:", data);
        // Assuming data is an array; if it's {classes: [...]}, change to data.classes
        setClasses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Class fetch error:", err);
        setError(err.message); // Show error to user
        setClasses([]);
        setLoading(false);
      });
  }, []); // Removed [API] since it's static

  if (loading) return <p>Loading classes...</p>; // Loading indicator
  if (error) return <p>Error: {error}</p>; // Error display

  return (
    <div>
      <h2>Select Class</h2>
      {classes.length === 0 && <p>No classes found</p>}
      {classes.map((cls) => (
        <button
          key={cls.id || cls.name || cls} // Better key: use ID if object, else fallback
          onClick={() => onSelect(cls)}
          style={{ margin: 10 }}
          aria-label={`Select ${typeof cls === 'object' ? cls.name : cls}`} // Accessibility
        >
          {typeof cls === 'object' ? cls.name : cls} {/* Handle objects or strings */}
        </button>
      ))}
    </div>
  );
}