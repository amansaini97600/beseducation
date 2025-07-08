// src/pages/StudentCertificateSearch.jsx

import { useState } from "react";
import certificateImg from "../admin/images/certificate.png";

export default function StudentCertificateSearch() {
    const [regNo, setRegNo] = useState("");
    const [certificate, setCertificate] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        setError("");
        setCertificate(null);

        try {
            const res = await fetch(`http://localhost:5000/api/certificates/search/${regNo}`);
            const data = await res.json();
            if (res.ok) {
                setCertificate(data);
            } else {
                setError("Certificate not found.");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6">
            {!certificate ? (
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-6">Search Your Certificate</h2>

                    <input
                        type="text"
                        placeholder="Enter Registration Number"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        className="w-full border p-2 rounded mb-4"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                    >
                        Search
                    </button>

                    {error && <p className="text-red-600 mt-4">{error}</p>}
                </div>
            ) : (
                <div className="overflow-auto w-full">
                    <div
                        className="relative mx-auto w-[840px] h-[600px] bg-cover bg-center shadow-md scale-[0.6] sm:scale-100 origin-top mt-10"
                        style={{ backgroundImage: `url('${certificateImg}')` }}
                    >
                        {/* Text Fields */}
                        <div className="absolute top-[257px] left-[400px] text-[16px] font-bold">
                            {certificate.name.toUpperCase()}
                        </div>
                        <div className="absolute top-[285px] left-[230px] text-[16px] font-bold">
                            {certificate.father_name.toUpperCase()}
                        </div>
                        <div className="absolute top-[341px] left-[233px] text-[16px] font-bold">
                            {certificate.course.toUpperCase()}
                        </div>
                        <div className="absolute top-[341px] right-[165px] text-[16px] font-bold">
                            {certificate.duration.toUpperCase()}
                        </div>
                        <div className="absolute bottom-[206px] left-[435px] text-[16px] font-bold">
                            "{certificate.grade}"
                        </div>
                        <div className="absolute bottom-[179px] left-[300px] text-[16px] font-bold">
                            {certificate.certificate_number}MBD/11907
                        </div>
                        <div className="absolute bottom-[179px] right-[95px] text-[16px] font-bold">
                            {new Date(certificate.issue_date).toLocaleDateString("en-GB")}
                        </div>

                        {/* Student Photo */}
                        <img
                            src={`http://localhost:5000${certificate.photo}`}
                            alt="Student"
                            className="absolute top-[136px] left-[581px] w-[88px] h-[125px] object-cover rounded border-[3px] border-orange-400"
                        />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-3 sm:hidden">
                        📱 Rotate your phone to landscape for best viewing experience.
                    </p>
                </div>
            )}
        </div>
    );

}
