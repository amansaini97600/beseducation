// EditDiploma.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditDiploma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    father_name: "",
    course: "",
    phone: "",
    aadhar: "",
    dateOfGeneration: "",
    dateOfCompilation: "",

  });

  useEffect(() => {
    const fetchDiploma = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`http://localhost:5000/api/diplomas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching diploma:", err);
      }
    };

    fetchDiploma();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`http://localhost:5000/api/diplomas/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Diploma updated successfully");
      navigate("/admin/diplomas");
    } catch (err) {
      console.error("Error updating diploma:", err);
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Diploma</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Student Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="father_name"
          value={formData.father_name}
          onChange={handleChange}
          placeholder="Father's Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="Course"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="aadhar"
          value={formData.aadhar}
          onChange={handleChange}
          placeholder="Aadhar Number"
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="dateOfCompilation"
          value={formData.compilation_date?.split("T")[0] || ""}
          onChange={handleChange}
          placeholder="Date of Compilation"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="dateOfGeneration"
          value={formData.generation_date?.split("T")[0] || ""}
          onChange={handleChange}
          placeholder="Date of Generation"
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Update Diploma
        </button>
      </form>
    </div>
  );
}
