import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function EditCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    course: "",
    duration: "",
    grade: "",
    issueDate: "",
    certificateType: "",
    certificateNumber: "",
    phoneNumber: "",
    aadharNumber: ""
  });

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        const data = res.data;
        setFormData({
          name: data.name,
          fatherName: data.father_name,
          course: data.course,
          duration: data.duration,
          grade: data.grade,
          issueDate: data.issue_date.split("T")[0],
          certificateType: data.type,
          certificateNumber: data.certificate_number,
          phoneNumber: data.phone,
          aadharNumber: data.aadhar,
        });
      } catch (err) {
        console.error("Failed to fetch certificate:", err);
      }
    };

    fetchCertificate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    if (photo) form.append("photo", photo);
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await axios.put(`http://localhost:5000/api/certificates/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      navigate("/admin/certificates");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update certificate");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <AdminHeader />
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Certificate</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="fatherName"
              placeholder="Father's Name"
              value={formData.fatherName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="course"
              placeholder="Course Name"
              value={formData.course}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <datalist id="course">
              <option value="ADCA" />
              <option value="DCA" />
              <option value="ACC" />
              <option value="TALLY PRIME WITH GST" />
              <option value="TALLY PRIME" />
              <option value="C PROGRAMMING LANGUAGE" />
              <option value="C++ PROGRAMMING LANGUAGE" />
              <option value="PYTHON PROGRAMMING LANGUAGE" />
              <option value="JAVA PROGRAMMING LANGUAGE" />
              <option value="JAVASCRIPT PROGRAMMING LANGUAGE" />
              <option value="HTML LANGUAGE" />
              <option value="CSS LANGUAGE" />
              <option value="FULL STACK DEVELOPER" />
            </datalist>

            <select
              name="duration"
              value={formData.duration.toUpperCase()}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="SIX MONTH">Six Months</option>
              <option value="THREE MONTH">Three Month</option>
            </select>

            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="S">S</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>

            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              placeholder="Aadhar Number"
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border p-2 rounded"
              required
            />

            <select
              name="certificateType"
              value={formData.certificateType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="Diploma">Diploma</option>
              <option value="Certificate">Certificate</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded w-full"
            >
              Update Certificate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
