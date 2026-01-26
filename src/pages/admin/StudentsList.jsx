import { useEffect, useState } from "react"

export default function StudentsList({ className }) {
  const [students, setStudents] = useState([])

  useEffect(() => {
    if (!className) return

    fetch(`http://localhost:3000/students?className=${className}`)
      .then(res => res.json())
      .then(data => setStudents(data))
  }, [className])

  if (!className) {
    return <p>Please select a class</p>
  }

  return (
    <div>
      <h3>Class {className}</h3>

      {students.length === 0 && <p>No students found</p>}

      {students.map(stu => (
        <p key={stu.regNo}>
          {stu.regNo} - {stu.name}
        </p>
      ))}
    </div>
  )
}
