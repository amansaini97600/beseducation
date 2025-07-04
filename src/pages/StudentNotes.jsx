import React, { useEffect, useState } from "react";

const subjectImages = {
    Excel: "/images/excel.png",
    "MS Word": "/images/word.png",
    Tally: "/images/tally.png",
    PowerPoint: "/images/ppt.png",
    HTML: "/images/html.png",
    CSS: "/images/css.png",
    JavaScript: "/images/js.png",
    Default: "/images/note.png",
};

const StudentNotes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/notes")
            .then((res) => res.json())
            .then((data) => setNotes(data))
            .catch((err) => console.error("Error fetching notes:", err));
    }, []);

    const subjects = ["All", ...new Set(notes.map((note) => note.subject))];

    const filteredNotes = notes.filter((note) => {
        const matchSubject =
            selectedSubject === "All" || note.subject === selectedSubject;
        const matchSearch =
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchSubject && matchSearch;
    });

    return (
        <div className="max-w-6xl mx-auto p-4 mt-6 pt-30">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
                Coaching Notes
            </h2>

            {/* 🔍 Search Input */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-4 py-2 rounded-full border ${selectedSubject === subject
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 border-blue-600"
                                } transition`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="Search by title or subject"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2 md:mt-0 w-full md:w-72 px-4 py-2 border rounded focus:outline-blue-500"
                />
            </div>

            {/* 📚 Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredNotes.map((note) => {
                    const img = subjectImages[note.subject] || subjectImages.Default;
                    return (
                        <div
                            key={note.id}
                            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                        >
                            <img
                                src={img}
                                alt={note.subject}
                                className="w-full h-40 object-contain mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-800">
                                {note.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">{note.subject}</p>
                            <div className="flex gap-2">
                                <a
                                    href={`http://localhost:5000/uploads/notes/${note.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    View
                                </a>
                                <a
                                    href={`http://localhost:5000/api/notes/download/${note.filename}`}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredNotes.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                    No notes found.
                </p>
            )}
        </div>
    );
};

export default StudentNotes;
