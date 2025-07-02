import { useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";


export default function AdminAddStudent() {
  const [form, setForm] = useState({
    name: "",
    father_name: "",
    address: "",
    phone: "",
    course: "",
    joined_date: "",
    aadhar: "",
    photo: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setForm({ ...form, photo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const data = new FormData();
    for (let key in form) {
      data.append(key, form[key]);
    }

    try {
      await axios.post("http://localhost:5000/api/admin/students", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      setMessage("Student added successfully!");
      setForm({
        name: "",
        father_name: "",
        address: "",
        phone: "",
        course: "",
        joined_date: "",
        aadhar: "",
        photo: null,
      });
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <AdminHeader />
        <div className="max-w-xl mx-auto p-6">
          <h2 className="text-xl font-bold mb-4">Add Student</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border" required />
            <input name="father_name" value={form.father_name} onChange={handleChange} placeholder="Father Name" className="w-full p-2 border" required />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border" required />
            <input name="course" value={form.course} onChange={handleChange} placeholder="Course Name" className="w-full p-2 border" required />
            <input type="date" name="joined_date" value={form.joined_date} onChange={handleChange} className="w-full p-2 border" required />
            <input name="aadhar" value={form.aadhar} onChange={handleChange} placeholder="Aadhar Number" className="w-full p-2 border" required />
            <input type="file" name="photo" onChange={handleChange} className="w-full p-2 border" accept="image/*" required />
            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded w-full">Add Student</button>
          </form>
          {message && <p className="mt-4 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}
