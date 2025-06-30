import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import EditStudentModal from "../components/EditStudentModal";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Students per page
  const [total, setTotal] = useState(0);


  useEffect(() => {
    fetch(`http://localhost:5000/api/students?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStudents(data.students);
        setTotal(data.total);
      });
  }, [page]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    fetch("http://localhost:5000/api/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(console.error);
  }, []);

  const filtered = (students || []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCourse ? s.course === filterCourse : true)
  );

  const courses = [...new Set((students || []).map(s => s.course))];

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;

    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete student");
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  };

  const handleSave = async (updatedData) => {
    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`http://localhost:5000/api/students/${updatedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedData.id ? updatedData : s))
      );
      setIsEditOpen(false);
    } catch (err) {
      alert("Failed to update student");
    }
  };



  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <AdminHeader />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Student List</h2>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-1/2"
            />

            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Courses</option>
              {courses.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
          

          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Father</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Course</th>
                <th className="p-2">Joined</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="text-center border-b">
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.father_name}</td>
                  <td className="p-2">{student.phone}</td>
                  <td className="p-2">{student.course}</td>
                  {/* <td className="p-2">{student.joined_date}</td> */}
                  <td className="p-2">
                    {new Date(student.joined_date).toLocaleDateString('en-GB')}
                  </td>

                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && <p className="text-center mt-4 text-gray-600">No students found</p>}
          <EditStudentModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            student={selectedStudent}
            onSave={handleSave}
          />

        </div>
      </div>
    </div>
  );
}
