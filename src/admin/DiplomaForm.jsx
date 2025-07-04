import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function DiplomaForm() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    course: "A.D.C.A.",
    institute: "CEC COMPUTER INSTITUTE, DHAMPUR",
    dateOfCompilation: "",
    dateOfGeneration: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    if (photo) form.append("photo", photo);

    try {
      const res = await axios.post("http://localhost:5000/api/diplomas", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const id = res.data.id;
      if (id) {
        navigate(`/admin/diploma/${id}`);
      } else {
        alert("Diploma generated but no ID returned.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Error generating diploma");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <AdminHeader />
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Generate Diploma</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Student Name"
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="Father's Name"
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Course"
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="institute"
              value={formData.institute}
              onChange={handleChange}
              placeholder="Institute Name"
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              name="dateOfCompilation"
              value={formData.dateOfCompilation}
              onChange={handleChange}
              placeholder="Date of Compilation"
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              name="dateOfGeneration"
              value={formData.dateOfGeneration}
              onChange={handleChange}
              placeholder="Date of Generation"
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Generate Diploma
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
