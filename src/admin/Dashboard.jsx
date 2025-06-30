import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    navigate("/admin");
    return;
  }

  fetch("http://localhost:5000/api/admin/data", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .catch(() => {
      localStorage.removeItem("adminToken");
      navigate("/admin");
    });
}, []);



const handleLogout = () => {
  localStorage.removeItem("adminToken");
  navigate("/admin-login");
};


  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <AdminHeader />

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded shadow text-center">
              <h3 className="text-xl font-bold">Total Students</h3>
              <p className="text-3xl mt-2 text-blue-700">120</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <h3 className="text-xl font-bold">Active Courses</h3>
              <p className="text-3xl mt-2 text-green-700">8</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <h3 className="text-xl font-bold">New Admissions</h3>
              <p className="text-3xl mt-2 text-orange-700">14</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
