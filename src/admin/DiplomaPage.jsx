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

    // const handlePrint = () => window.print();
    const handlePrint = () => {
        const printContents = document.getElementById("print-area").innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Optional: to reload the page after print
    };


    if (!diploma) return <div className="text-center p-10">Loading...</div>;

    const groupedMarks = marks.reduce((acc, mark) => {
        if (!acc[mark.subject]) acc[mark.subject] = {};
        acc[mark.subject][mark.term] = mark;
        return acc;
    }, {});


    return (
        <>
            <style>
                {`
    @media print {
        body * {
            visibility: hidden !important;
        }

        #print-area, #print-area * {
            visibility: visible !important;
        }

        #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            background: url('${diplomaImg}') no-repeat center center !important;
            background-size: cover !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        .no-print {
            display: none !important;
        }

        @page {
            size: A4 portrait;
            margin: 0;
        }
    }
`}
            </style>
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
                                padding: "94px",
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
                            <div className="flex pt-35">
                                <div className="flex-1 pr-4 flex items-end">
                                    <table className="table-auto w-full text-left border-separate border-spacing-y-2">
                                        <tbody>
                                            <tr>
                                                <td className="font-bold">NAME</td>
                                                <td className="pr-3">:</td>
                                                <td>{diploma.name.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold">FATHER NAME</td>
                                                <td>:</td>
                                                <td>{diploma.father_name.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold">COURSE</td>
                                                <td>:</td>
                                                <td>{diploma.course}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold">INSTITUTE</td>
                                                <td>:</td>
                                                <td>{diploma.institute}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Right Side - Fixed Width for Photo + Diploma Number */}
                                <div className="w-32 flex flex-col items-end space-y-2">
                                    <div className="text-sm font-bold border border-gray-300 rounded-md shadow-md px-3 py-1 text-gray-700">
                                        {diploma.diploma_number}/MBD11907
                                    </div>
                                    {diploma.photo && (
                                        <img
                                            src={`http://localhost:5000${diploma.photo}`}
                                            alt="Student"
                                            className="w-32 h-40 object-cover border"
                                        />
                                    )}
                                </div>
                            </div>


                            {/* <div>{new Date(diploma.compilation_date).toLocaleDateString("en-GB")}</div>
                                <div>{new Date(diploma.generation_date).toLocaleDateString("en-GB")}</div> */}

                            <div className="mt-8">
                                <table className="w-full border text-center">
                                    <thead>
                                        <tr className="px-10">
                                            <th className="border py-2 ">Sr. No.</th>
                                            <th className="border ">SUBJECT</th>
                                            <th className="border ">THEORY</th>
                                            <th className="border ">PRACTICAL</th>
                                            <th className="border ">GRADE</th>
                                        </tr>
                                        <tr>
                                            <th colSpan={5} className="border py-2">-TERM-I-</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(groupedMarks).map(([subject, terms], index) => (
                                            <>
                                                <tr key={`${subject}-1`}>
                                                    <td className="border py-1">{index + 1}</td>
                                                    <td className="border font-semibold text-left pl-3">{subject}</td>
                                                    <td className="border">{terms.I?.theory}</td>
                                                    <td className="border">{terms.I?.practical}</td>
                                                    <td className="border">A</td>
                                                </tr>
                                            </>
                                        ))}
                                        <tr>
                                            <th colSpan={5} className="border py-2">-TERM-II-</th>
                                        </tr>
                                        {Object.entries(groupedMarks).map(([subject, terms], index) => (
                                            <>
                                                <tr key={`${subject}-2`}>
                                                    <td className="border py-1">{index + 1}</td>
                                                    <td className="border font-semibold text-left pl-3">{subject}</td>
                                                    <td className="border">{terms.II?.theory}</td>
                                                    <td className="border">{terms.II?.practical}</td>
                                                    <td className="border">A</td>
                                                </tr>
                                            </>
                                        ))}
                                        <tr className="font-semibold">
                                            <td className="py-3 text-left pl-3"><strong>Total: </strong></td>
                                            <td>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-left ">{diploma.total}</div>
                                                    <div>{Number(diploma.percentage).toFixed(2)}%</div>
                                                </div>
                                            </td>
                                            <td colSpan={3} className="border"><strong className="pr-5">Total Cred: </strong>  {diploma.grade}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
