import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import diplomaImg from './images/diploma.png';


export default function DiplomaPage() {
    const { id } = useParams();
    const [diploma, setDiploma] = useState(null);
    const [marks, setMarks] = useState([]);

    useEffect(() => {
        const fetchDiploma = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res1 = await fetch(`http://localhost:5000/api/diplomas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const diplomaData = await res1.json();

                const res2 = await fetch(`http://localhost:5000/api/diplomas/${id}/marks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const marksData = await res2.json();

                setDiploma(diplomaData);
                setMarks(marksData);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchDiploma();
    }, [id]);

    const handlePrint = () => window.print();

    if (!diploma) return <div className="text-center p-10">Loading...</div>;

    const groupedMarks = marks.reduce((acc, mark) => {
        if (!acc[mark.subject]) acc[mark.subject] = {};
        acc[mark.subject][mark.term] = mark;
        return acc;
    }, {});

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <AdminHeader />

                <div className="p-4">
                    <div
                        id="print-area"
                        style={{
                            width: "100%",
                            maxWidth: "885px",
                            margin: "0 auto",
                            backgroundImage: `url('${diplomaImg}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            position: "relative",
                            height: "1175px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                            padding: "60px",
                        }}
                    >
                        <div className="flex justify-between mb-6 absolute">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 text-white px-4 py-2 rounded no-print"
                            >
                                Print Diploma
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-55">
                            <div>
                                <div> {diploma.name}</div>
                                <div>{diploma.father_name}</div>
                                <div>{diploma.course}</div>
                                <div>{diploma.institute}</div>
                                <div>{diploma.certificate_number}</div>
                                <div>{diploma.compilation_date}</div>
                                <div>{diploma.generation_date}</div>
                            </div>
                            <div>
                                {diploma.photo && (
                                    <img
                                        src={`http://localhost:5000${diploma.photo}`}
                                        alt="Student"
                                        className="w-40 h-40 object-cover border"
                                    />
                                )}
                                {/* <p><strong>Total:</strong> {diploma.total}</p>
                                <p><strong>Percentage:</strong> {diploma.percentage}%</p>
                                <p><strong>Grade:</strong> {diploma.grade}</p> */}
                            </div>
                        </div>

                        <div className="mt-8">
                            <table className="w-full border text-center">
                                <thead>
                                    <tr className="px-10">
                                        <th className="border py-3">Sr. No.</th>
                                        <th className="border py-3">SUBJECT</th>
                                        <th className="border py-3">THEORY</th>
                                        <th className="border py-3">PRACTICAL</th>
                                        <th className="border py-3">GRADE</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={5} className="border py-3">-TERM-I-</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(groupedMarks).map(([subject, terms]) => (
                                        <>
                                            <tr key={`${subject}-1`}>
                                                <td className="border">1</td>
                                                <td className="border font-semibold text-left pl-3">{subject}</td>
                                                <td className="border">{terms.I?.theory}</td>
                                                <td className="border">{terms.I?.practical}</td>
                                                <td className="border">A</td>
                                            </tr>
                                        </>
                                    ))}
                                    <tr>
                                        <th colSpan={5} className="border py-3">-TERM-II-</th>
                                    </tr>
                                    {Object.entries(groupedMarks).map(([subject, terms]) => (
                                        <>
                                            <tr key={`${subject}-2`}>
                                                <td className="border">1</td>
                                                <td className="border font-semibold text-left pl-3">{subject}</td>
                                                <td className="border">{terms.II?.theory}</td>
                                                <td className="border">{terms.II?.practical}</td>
                                                <td className="border">A</td>
                                            </tr>
                                        </>
                                    ))}
                                    <tr className="font-semibold">
                                        <td className="py-3 ">Total:   {diploma.total}</td>
                                        <td>{diploma.percentage}%</td>
                                        <td colSpan={3} className="border">Total Cred:   {diploma.grade}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
