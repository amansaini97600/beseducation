import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

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

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCourse ? s.course === filterCourse : true)
  );

  const courses = [...new Set(students.map(s => s.course))];

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
                  <td className="p-2">{student.joined_date}</td>
                  <td className="p-2">
                    <button className="text-blue-600 hover:underline mr-2">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && <p className="text-center mt-4 text-gray-600">No students found</p>}
        </div>
      </div>
    </div>
  );
}
