import { useState, useEffect } from "react"
import Login from "./pages/Login"

import StudentHome from "./pages/students/Home"
import StudentAttendance from "./pages/students/Attendance"
import StudentEvents from "./pages/students/Events"
import StudentMarks from "./pages/students/Marks"
import StudentFees from "./pages/students/Fees"
import StudentFiles from "./pages/students/Files"
import StudentReport from "./pages/students/StudentReport"
import StudentDashboard from "./pages/students/Dashboard"



import AdminHome from "./pages/admin/Home"
import UploadAttendance from "./pages/admin/UploadAttendance"
import UploadMarks from "./pages/admin/UploadMarks"
import UploadFiles from "./pages/admin/UploadFiles"
import UploadEvents from "./pages/admin/UploadEvents"
import UploadFees from "./pages/admin/UploadFees"
import PayFees from "./pages/admin/PayFees"





import Sidebar from "./components/Sidebar"

export default function App() {
  // 🔐 role
  const [role, setRole] = useState(
  localStorage.getItem("role")
)

const [page, setPage] = useState(() => {
  return localStorage.getItem("page")
})


const [selectedClass, setSelectedClass] = useState(
  localStorage.getItem("selectedClass")
)



  // 🔄 role change aagum pothu default page set pannrom




  // 🚪 logout
  const handleLogout = () => {
    localStorage.removeItem("role")
    setRole(null)
    setPage(null)
  }

  // 🔑 login illa na
 if (!role) {
  return <Login  />
}


  let content = null

// ================= STUDENT =================

if (role === "student") {
  if (page === "home") content = <StudentDashboard />
  else if (page === "attendance") content = <StudentAttendance />
  else if (page === "events") content = <StudentEvents />
  else if (page === "marks") content = <StudentMarks />
  else if (page === "fees") content = <StudentFees />
  else if (page === "files") content = <StudentFiles />
  else if (page === "report") content = <StudentReport />
}



  // ADMIN
if (role === "admin") {
  if (page === "home") content = <AdminHome />

  
  

  else if (page === "uploadAttendance") content = <UploadAttendance />
  else if (page === "uploadMarks") content = <UploadMarks />
  else if (page === "uploadFiles") content = <UploadFiles />
  else if (page === "uploadEvents") content = <UploadEvents />
  else if (page === "uploadFees") content = <UploadFees />
  else if (page === "payFees") content = <PayFees />  
}



  return (
    <div className="flex">
      <Sidebar
        role={role}
        setPage={setPage}
        handleLogout={handleLogout}
      />

      <main className="flex-1 p-8 bg-gray-100">
        {content}
      </main>
    </div>
  )
}
