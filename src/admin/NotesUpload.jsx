import React, { useState } from 'react';
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const NotesUpload = () => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('subject', formData.subject);
        data.append('file', formData.file);

        // Replace this with your backend endpoint
        try {
            const res = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                body: data,
            });
            if (res.ok) {
                alert("Note uploaded successfully!");
                setFormData({ title: '', subject: '', file: null });
            } else {
                alert("Upload failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <AdminHeader />
                <div className="max-w-xl mx-auto p-4 mt-6 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Upload Coaching Notes</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Note Title (e.g., HTML Basics)"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />

                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="">Select Subject</option>
                            <option value="Excel">Excel</option>
                            <option value="MS Word">MS Word</option>
                            <option value="Tally">Tally</option>
                            <option value="PowerPoint">PowerPoint</option>
                            <option value="HTML">HTML</option>
                            <option value="CSS">CSS</option>
                            <option value="JavaScript">JavaScript</option>
                        </select>

                        <input
                            type="file"
                            name="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-100"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Upload Note
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NotesUpload;
