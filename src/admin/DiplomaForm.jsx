import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function DiplomaForm() {
  const formatDate = (date) => date.toISOString().split("T")[0];

  // 1 year ago from today
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const [errors, setErrors] = useState({});


  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    course: "A.D.C.A.",
    institute: "CEC COMPUTER INSTITUTE, DHAMPUR",
    phone: "",
    aadhar: "",
    dateOfCompilation: formatDate(oneYearAgo),
    dateOfGeneration: formatDate(new Date()),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfCompilation") {
      const newCompilation = new Date(value);
      const newGeneration = new Date(value);
      newGeneration.setFullYear(newGeneration.getFullYear() + 1);

      setFormData((prev) => ({
        ...prev,
        dateOfCompilation: value,
        dateOfGeneration: formatDate(newGeneration),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const aadharRegex = /^\d{12}$/;

    if (!formData.name || !nameRegex.test(formData.name)) {
      newErrors.name = "Enter a valid name (letters only)";
    }
    if (!formData.fatherName || !nameRegex.test(formData.fatherName)) {
      newErrors.fatherName = "Enter a valid father's name (letters only)";
    }
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!aadharRegex.test(formData.aadhar)) {
      newErrors.aadhar = "Enter a valid 12-digit Aadhar number";
    }
    if (!photo) {
      newErrors.photo = "Photo is required";
    }

    setErrors(newErrors);

    // If any errors exist, prevent submission
    if (Object.keys(newErrors).length > 0) return;

    // Submit data if valid
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    form.append("photo", photo);

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
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}


            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="Father's Name"
              required
              className="w-full border p-2 rounded"
            />
            {errors.fatherName && <p className="text-red-500 text-sm">{errors.fatherName}</p>}


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
              readOnly
              placeholder="Institute Name"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full border p-2 rounded"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              placeholder="Aadhar Number"
              required
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
              readOnly
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
            {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}


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
