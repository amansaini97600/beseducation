import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import EditStudentModal from "../components/EditStudentModal";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/students", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    })
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch {
      alert("Failed to delete student");
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  };

  const handleSave = async (updated) => {
    try {
      await fetch(`http://localhost:5000/api/students/${updated.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(updated),
      });
      setStudents(prev => prev.map(s => (s.id === updated.id ? updated : s)));
      setIsEditOpen(false);
    } catch {
      alert("Failed to update student");
    }
  };

  const filtered = students?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCourse ? s.course === filterCourse : true)
  );

  const courses = [...new Set(students.map(s => s.course))];
  const totalPages = Math.ceil(filtered.length / studentsPerPage);
  const currentStudents = filtered.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 border rounded w-1/2"
            />
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value);
                setCurrentPage(1);
              }}
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
              {currentStudents.map((student) => (
                <tr key={student.id} className="text-center border-b">
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.father_name}</td>
                  <td className="p-2">{student.phone}</td>
                  <td className="p-2">{student.course}</td>
                  <td className="p-2">
                    {new Date(student.joined_date).toLocaleDateString("en-GB")}
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

          {filtered.length === 0 && (
            <p className="text-center mt-4 text-gray-600">No students found</p>
          )}

          <EditStudentModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            student={selectedStudent}
            onSave={handleSave}
          />

          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
