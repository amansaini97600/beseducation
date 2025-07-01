import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function CertificatePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`http://localhost:5000/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          console.error("Failed to fetch certificate:", result.message);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchCertificate();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!data) {
    return <p className="text-center mt-10 text-gray-600">Loading certificate...</p>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print Certificate
        </button>
      </div>

      <div
        ref={printRef}
        className="w-full max-w-4xl mx-auto border p-4 bg-white"
        style={{
          backgroundImage: `url('/images/certificate-template.png')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '900px',
          position: 'relative',
        }}
      >
        <div className="absolute inset-0 p-20 text-lg leading-relaxed text-black">
          <p>
            The Diploma is awarded to <strong>{data.name}</strong> on successful completion of <strong>{data.course}</strong>.
          </p>
          <p>
            S/o D/o: <strong>{data.fatherName}</strong>
          </p>
          <p>
            At: <strong>{data.center || "Your Center Name"}</strong>
          </p>
          <p>
            Duration: <strong>{data.duration}</strong>
          </p>
          <p>
            Grade: <strong>{data.grade}</strong>
          </p>
          <p>
            Registration No: <strong>{data.regNo || id}</strong>
          </p>
          <p>
            Date of Issue: <strong>{new Date(data.issueDate).toLocaleDateString("en-GB")}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
