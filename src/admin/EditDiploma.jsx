// EditDiploma.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditDiploma() {
const [errors, setErrors] = useState({});
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

      const data = res.data;

      // Manual mapping of date fields
      setFormData({
        name: data.name,
        father_name: data.father_name,
        course: data.course,
        phone: data.phone,
        aadhar: data.aadhar,
        dateOfCompilation: data.compilation_date?.split("T")[0] || "",
        dateOfGeneration: data.generation_date?.split("T")[0] || "",
      });
    } catch (err) {
      console.error("Error fetching diploma:", err);
    }
  };

  fetchDiploma();
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfCompilation") {
      const compilationDate = new Date(value);
      const generationDate = new Date(compilationDate);
      generationDate.setFullYear(compilationDate.getFullYear() + 1);

      setFormData((prev) => ({
        ...prev,
        dateOfCompilation: value,
        dateOfGeneration: generationDate.toISOString().split("T")[0],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const aadharRegex = /^\d{12}$/;

    if (!formData.name || !nameRegex.test(formData.name)) {
      newErrors.name = "Enter a valid name (letters only)";
    }
    if (!formData.father_name || !nameRegex.test(formData.father_name)) {
      newErrors.father_name = "Enter a valid father's name (letters only)";
    }
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!aadharRegex.test(formData.aadhar)) {
      newErrors.aadhar = "Enter a valid 12-digit Aadhar number";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          type="text"
          name="father_name"
          value={formData.father_name}
          onChange={handleChange}
          placeholder="Father's Name"
          className="w-full border p-2 rounded"
          required
        />
        {errors.father_name && <p className="text-red-500 text-sm">{errors.father_name}</p>}

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
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        <input
          type="text"
          name="aadhar"
          value={formData.aadhar}
          onChange={handleChange}
          placeholder="Aadhar Number"
          className="w-full border p-2 rounded"
        />
        {errors.aadhar && <p className="text-red-500 text-sm">{errors.aadhar}</p>}

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
