import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const NotesList = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/notes")
            .then((res) => res.json())
            .then((data) => setNotes(data))
            .catch((err) => console.error("Error fetching notes:", err));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setNotes(notes.filter((note) => note.id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting");
        }
    };


    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <AdminHeader />
                <div className="max-w-5xl mx-auto p-4 mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Uploaded Notes</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow rounded-xl">
                            <thead>
                                <tr className="bg-blue-100 text-left">
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Subject</th>
                                    <th className="p-3">Uploaded At</th>
                                    <th className="p-3">Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notes.map((note) => (
                                    <tr key={note.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3">{note.title}</td>
                                        <td className="p-3">{note.subject}</td>
                                        <td className="p-3">
                                            {new Date(note.uploaded_at).toLocaleString()}
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            <a
                                                href={`http://localhost:5000/uploads/notes/${note.filename}`}
                                                download
                                                className="text-blue-600 hover:underline"
                                            >
                                                Download
                                            </a>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {notes.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4 text-gray-500">
                                            No notes uploaded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesList;
