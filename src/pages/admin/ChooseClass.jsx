import { useEffect, useState } from "react"

export default function ChooseClass({ onSelect }) {
  const [classes, setClasses] = useState([])
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetch(`${API}/classes`)
      .then(res => res.json())
      .then(data => {
        console.log("Classes:", data)
        setClasses(data)
      })
      .catch(err => console.log("Class fetch error", err))
  }, [])

  return (
    <div>
      <h2>Select Class</h2>

      {classes.length === 0 && <p>No classes found</p>}

      {classes.map(cls => (
        <button
          key={cls}
          onClick={() => onSelect(cls)}
          style={{ margin: 10 }}
        >
          {cls}
        </button>
      ))}
    </div>
  )
}
