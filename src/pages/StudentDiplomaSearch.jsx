import { useState } from "react";
import diplomaImg from '../admin/images/diploma.png';

export default function StudentDiplomaSearch() {
    const [searchId, setSearchId] = useState("");
    const [diploma, setDiploma] = useState(null);
    const [marks, setMarks] = useState([]);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        try {
            setError("");
            setDiploma(null);
            setMarks([]);

            const res1 = await fetch(`https://beseducation.onrender.com/api/diplomas/search/${searchId}`);
            if (!res1.ok) throw new Error("Diploma not found");
            const diplomaData = await res1.json();

            const res2 = await fetch(`https://beseducation.onrender.com/api/diplomas/search/${searchId}/marks`);
            if (!res2.ok) throw new Error("Marks not found");
            const marksData = await res2.json();

            setDiploma(diplomaData);
            setMarks(marksData);
        } catch (err) {
            setError("Diploma not found. Please check the number.");
            console.error(err);
        }
    };

    const groupedMarks = marks.reduce((acc, mark) => {
        if (!acc[mark.subject]) acc[mark.subject] = {};
        acc[mark.subject][mark.term] = mark;
        return acc;
    }, {});

    return (
        <div className="bg-gray-100 min-h-screen p-6 mt-16">
            {!diploma ? (
            <div className="max-w-xl mx-auto bg-white rounded shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Diploma Search</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter Diploma Number"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Search
                    </button>
                </div>
                {error && <p className="text-red-500 mt-3">{error}</p>}
            </div>)

             : (
                <div className="relative bg-white shadow-md max-w-4xl mx-auto p-15" style={{ height: "1120px", width: "790px"}}>
                    <img
                        src={diplomaImg}
                        alt="Diploma Background"
                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    />

                    <div className="relative z-10 pt-36">
                        <div className="flex">
                            <div className="flex-1 pr-4 flex items-end">
                                <table className="table-auto w-full text-left border-separate border-spacing-y-2">
                                    <tbody>
                                        <tr>
                                            <td className="font-bold">NAME</td>
                                            <td className="pr-3">:</td>
                                            <td className="font-semibold">{diploma.name.toUpperCase()}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">FATHER NAME</td>
                                            <td>:</td>
                                            <td className="font-semibold">{diploma.father_name.toUpperCase()}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">COURSE</td>
                                            <td>:</td>
                                            <td className="font-semibold">{diploma.course}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">INSTITUTE</td>
                                            <td>:</td>
                                            <td className="font-semibold">{diploma.institute}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-32 flex flex-col items-end space-y-2">
                                <div className="text-sm font-bold border border-gray-300 rounded-md shadow-md px-3 py-1">
                                    {diploma.diploma_number}/MBD11907
                                </div>
                                {diploma.photo && (
                                    <img
                                        src={`https://beseducation.onrender.com${diploma.photo}`}
                                        alt="Student"
                                        className="w-30 h-40 object-cover border rounded-md"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <table className="w-full border text-center">
                                <thead>
                                    <tr>
                                        <th className="border py-2">Sr. No.</th>
                                        <th className="border">SUBJECT</th>
                                        <th className="border">THEORY</th>
                                        <th className="border">PRACTICAL</th>
                                        <th className="border">GRADE</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={5} className="border py-2">-TERM-I-</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(groupedMarks).map(([subject, terms], index) => (
                                        <tr key={`${subject}-1`}>
                                            <td className="border py-0.5 font-semibold">{index + 1}</td>
                                            <td className="border font-semibold text-left pl-3">{subject}</td>
                                            <td className="border font-semibold">{terms.I?.theory}/100</td>
                                            <td className="border font-semibold">{terms.I?.practical}/50</td>
                                            <td className="border font-semibold">A</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th colSpan={5} className="border py-2">-TERM-II-</th>
                                    </tr>
                                    {Object.entries(groupedMarks).map(([subject, terms], index) => (
                                        <tr key={`${subject}-2`}>
                                            <td className="border py-0.5 font-semibold">{index + 1}</td>
                                            <td className="border font-semibold text-left pl-3">{subject}</td>
                                            <td className="border font-semibold">{terms.II?.theory}/100</td>
                                            <td className="border font-semibold">{terms.II?.practical}/50</td>
                                            <td className="border font-semibold">A</td>
                                        </tr>
                                    ))}
                                    <tr className="font-semibold">
                                        <td className="py-2 text-left pl-3"><strong>Total : </strong></td>
                                        <td>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-left font-semibold">{diploma.total}</div>
                                                <div className="font-semibold">{Number(diploma.percentage).toFixed(2)}%</div>
                                            </div>
                                        </td>
                                        <td colSpan={3} className="border"><strong className="pr-5 ">Total Cred : </strong>  {diploma.grade}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex pt-13 justify-between font-semibold">
                                <div className="items-end flex flex-col w-65">{new Date(diploma.compilation_date).toLocaleDateString("en-GB")}</div>
                                <div>{new Date(diploma.generation_date).toLocaleDateString("en-GB")}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
