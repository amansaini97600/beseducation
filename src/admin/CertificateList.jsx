import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function CertificateList() {
    const [certificates, setCertificates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    const exportToExcel = () => {
        const exportData = currentCertificates.map(({ id, name, phone, aadhar, course, certificate_number, issue_date }) => ({
            ID: id,
            Name: name,
            Phone: phone,
            Aadhar: aadhar,
            Course: course,
            CertificateNo: certificate_number,
            IssueDate: new Date(issue_date).toLocaleDateString("en-GB"),
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Certificates");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "certificates.xlsx");
    };

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/certificates", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                });
                setCertificates(res.data);
            } catch (err) {
                console.error("Error fetching certificates:", err);
            }
        };

        fetchCertificates();
    }, []);

    // Filter logic
    const filteredCertificates = certificates.filter((cert) => {
        const value = searchTerm.toLowerCase();
        return (
            cert.name.toLowerCase().includes(value) ||
            cert.certificate_number?.toLowerCase().includes(value) ||
            cert.aadhar?.toLowerCase().includes(value) ||
            cert.phone?.toLowerCase().includes(value)
        );
    });

    const [currentPage, setCurrentPage] = useState(1);
    const certificatesPerPage = 10;

    const indexOfLastCert = currentPage * certificatesPerPage;
    const indexOfFirstCert = indexOfLastCert - certificatesPerPage;
    const currentCertificates = filteredCertificates.slice(indexOfFirstCert, indexOfLastCert);

    const totalPages = Math.ceil(filteredCertificates.length / certificatesPerPage);

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <AdminHeader />
                <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow">
                    <h2 className="text-2xl font-bold mb-4">All Certificates</h2>

                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search by name, certificate no, Aadhar or phone"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded w-1/2"
                        />
                        <button
                            onClick={exportToExcel}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Export to Excel
                        </button>
                    </div>


                    <table className="w-full table-auto border text-sm">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">Name</th>
                                <th className="border px-2 py-1">Phone</th>
                                <th className="border px-2 py-1">Aadhar</th>
                                <th className="border px-2 py-1">Course</th>
                                <th className="border px-2 py-1">Cert No</th>
                                <th className="border px-2 py-1">Issue Date</th>
                                <th className="border px-2 py-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCertificates.map((cert) => (
                                <tr key={cert.id}>
                                    <td className="border px-2 py-1">{cert.id}</td>
                                    <td className="border px-2 py-1">{cert.name}</td>
                                    <td className="border px-2 py-1">{cert.phone}</td>
                                    <td className="border px-2 py-1">{cert.aadhar}</td>
                                    <td className="border px-2 py-1">{cert.course}</td>
                                    <td className="border px-2 py-1">{cert.certificate_number}</td>
                                    <td className="border px-2 py-1">
                                        {new Date(cert.issue_date).toLocaleDateString("en-GB")}
                                    </td>
                                    <td className="border px-2 py-1 flex gap-2">
                                        <Link
                                            to={`/admin/edit-certificate/${cert.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            to={`/admin/certificate/${cert.id}`}
                                            className="text-green-600 hover:underline"
                                            target="_blank"  // Open in new tab
                                        >
                                            Print
                                        </Link>
                                    </td>

                                </tr>
                            ))}
                            {filteredCertificates.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center p-4">
                                        No certificates found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
