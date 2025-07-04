import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function CertificateForm() {
    const navigate = useNavigate();
    const [photo, setPhoto] = useState(null);


    const [formData, setFormData] = useState({
        name: "",
        fatherName: "",
        course: "",
        duration: "",
        completionDate: "",
        grade: "",
        issueDate: new Date().toISOString().split("T")[0],
        certificateType: "Diploma",
        aadharNumber: "",
        phoneNumber: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("photo", photo);
        for (const key in formData) {
            form.append(key, formData[key]);
        }

        try {
            const res = await axios.post("http://localhost:5000/api/certificates", form, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const certificateId = res.data.id;
            if (certificateId) {
                navigate(`/admin/certificate/${certificateId}`);
            } else {
                alert("Certificate generated but ID missing in response.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to generate certificate");
        }
    };

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <AdminHeader />
                <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-6 text-center">Generate Certificate/Diploma</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            type="text"
                            name="name"
                            placeholder="Student Name"
                            value={formData.name.toUpperCase()}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />

                        <input
                            type="text"
                            name="fatherName"
                            placeholder="Father's Name"
                            value={formData.fatherName.toUpperCase()}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                            
                        />

                        <input
                            type="text"
                            name="course"
                            placeholder="Course Name"
                            value={formData.course.toUpperCase()}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            list="course"
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
                            required
                        >
                            <option value="SIX MONTH">Six Months</option>
                            <option value="THREE MONTH">Three Month</option>
                        </select>

                        <select
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
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
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="w-full p-2 border rounded"
                            required
                        />

                        <input
                            type="text"
                            name="aadharNumber"
                            value={formData.aadharNumber}
                            onChange={handleChange}
                            placeholder="Aadhar Number"
                            className="w-full p-2 border rounded"
                            required
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            className="w-full border p-2 rounded"
                            required
                        />


                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded w-full"
                        >
                            Generate & Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
