import { useEffect, useState } from "react"

export default function ChooseClass({ onSelect }) {
  const [classes, setClasses] = useState([])

console.log("ChooseClass rendered")
console.log("Classes state:", classes)


 const API = import.meta.env.VITE_API_URL

useEffect(() => {
  fetch(`${API}/classes`)
    .then(res => res.json())
    .then(data => setClasses(data))
}, [])


  return (
    <div>
      <h2>Select Class</h2>

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
