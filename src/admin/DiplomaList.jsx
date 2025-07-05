// DiplomaList.jsx - React Frontend Component
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function DiplomaList() {
    const [diplomas, setDiplomas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const diplomasPerPage = 10;

    useEffect(() => {
        const fetchDiplomas = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch("http://localhost:5000/api/diplomas", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setDiplomas(data);
                } else {
                    console.error("Failed to fetch diplomas:", data.message);
                }
            } catch (err) {
                console.error("Error fetching diplomas:", err);
            }
        };
        fetchDiplomas();
    }, []);

    const filteredDiplomas = diplomas.filter((d) => {
        const term = searchTerm.toLowerCase();
        return (
            d.name.toLowerCase().includes(term) ||
            d.father_name.toLowerCase().includes(term) ||
            d.aadhar?.includes(term) ||
            d.phone?.includes(term) ||
            d.certificate_number?.includes(term)
        );
    });

    const indexOfLast = currentPage * diplomasPerPage;
    const indexOfFirst = indexOfLast - diplomasPerPage;
    const currentDiplomas = filteredDiplomas.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredDiplomas.length / diplomasPerPage);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredDiplomas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Diplomas");
        XLSX.writeFile(workbook, "Diplomas.xlsx");
    };

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <AdminHeader />
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Diploma List</h2>

                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search by name, aadhar, phone, number"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border px-2 py-1 rounded w-1/2"
                        />
                        <button
                            onClick={exportToExcel}
                            className="bg-green-600 text-white px-4 py-1 rounded"
                        >
                            Export Excel
                        </button>
                    </div>

                    <table className="w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-1">#</th>
                                <th className="border p-1">Name</th>
                                <th className="border p-1">Father</th>
                                <th className="border p-1">Course</th>
                                <th className="border p-1">Phone</th>
                                <th className="border p-1">Aadhar</th>
                                <th className="border p-1">Certificate No</th>
                                <th className="border p-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDiplomas.map((d, i) => (
                                <tr key={d.id}>
                                    <td className="border p-1">{indexOfFirst + i + 1}</td>
                                    <td className="border p-1">{d.name}</td>
                                    <td className="border p-1">{d.father_name}</td>
                                    <td className="border p-1">{d.course}</td>
                                    <td className="border p-1">{d.phone}</td>
                                    <td className="border p-1">{d.aadhar}</td>
                                    <td className="border p-1">{d.certificate_number}</td>
                                    <td className="border p-1 space-x-2">
                                        <Link
                                            to={`/admin/print-diploma/${d.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Print
                                        </Link>
                                        <Link
                                            to={`/admin/edit-diploma/${d.id}`}
                                            className="text-green-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* <div className="mt-4 flex justify-center space-x-2">
                        {Array.from({ length: totalPages }, (_, idx) => (
                            <button
                                key={idx}
                                className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? "bg-blue-500 text-white" : ""
                                    }`}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div> */}

                    <div className="flex justify-center mt-6 space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded ${currentPage === index + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
