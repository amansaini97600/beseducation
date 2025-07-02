import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import certificateImg from './images/certificate.png';

export default function CertificatePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

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
    const printWindow = window.open("", "", "width=1200,height=800");

    const certificateHTML = `
      <div id="print-area" style="
        width: 100vw;
        height: 100vh;
        background-image: url('${certificateImg}');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
        box-sizing: border-box;
          padding: 20px;
      ">
        <div style="
          position: absolute;
          inset: 0;
          padding: 60px;
          font-size: 18px;
          line-height: 1.6;
          color: black;
        ">
          <p>The Diploma is awarded to <strong>${data.name}</strong> on successful completion of <strong>${data.course}</strong>.</p>
          <p>S/o D/o: <strong>${data.fatherName}</strong></p>
          <p>At: <strong>${data.center || "CEC COMPUTER CENTER DHAMPUR"}</strong></p>
          <p>Duration: <strong>${data.duration}</strong></p>
          <p>Grade: <strong>${data.grade}</strong></p>
          <p>Registration No: <strong>${data.regNo || id}</strong></p>
          <p>Date of Issue: <strong>${new Date(data.issueDate).toLocaleDateString("en-GB")}</strong></p>
        </div>
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Certificate</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #print-area {
              width: 100vw;
              height: 100vh;
              background: white;
            }
          </style>
        </head>
        <body>
          ${certificateHTML}
          <script>
            window.onload = function () {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
  };

  if (!data) {
    return <p className="text-center mt-10 text-gray-600">Loading certificate...</p>;
  }

  return (
    <div className="p-4">
      <div className="mt-6 absolute right-[180px] bottom-[50px]">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print Certificate
        </button>
      </div>
      <div
        id="print-area"
        style={{
          width: "100%",
          maxWidth: "840px",
          margin: "0 auto",
          backgroundImage: `url('${certificateImg}')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          position: "relative",
          height: "600px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        {/* <div className="absolute inset-0 p-10 text-lg leading-relaxed text-black">
          <p><strong>{data.name}</strong><strong>{data.course}</strong>.</p>
          <p><strong>{data.fatherName} veer singh</strong></p>
          <p><strong>{data.center || "CEC COMPUTER CENTER DHAMPUR"}</strong></p>
          <p><strong>{data.duration}</strong></p>
          <p><strong>{data.grade}</strong></p>
          <p><strong>{data.regNo || id}</strong></p>
          <p><strong>{new Date(data.issueDate).toLocaleDateString("en-GB")}</strong></p>
        </div> */}
        <div style={{ position: "absolute", top: "85px", left: "80px", fontSize: "16px", fontWeight: "bold" }}>{data.name}</div>
        <div style={{ position: "absolute", top: "115px", left: "80px", fontSize: "16px", fontWeight: "bold" }}>{data.father_name}</div>
        <div style={{ position: "absolute", top: "145px", left: "80px", fontSize: "16px", fontWeight: "bold" }}>{data.center || "CEC COMPUTER CENTER DHAMPUR"}</div>
        <div style={{ position: "absolute", top: "175px", left: "80px", fontSize: "16px", fontWeight: "bold" }}>{data.duration}</div>
        <div style={{ position: "absolute", top: "205px", left: "80px", fontSize: "16px", fontWeight: "bold" }}>{data.grade}</div>
        <div style={{ position: "absolute", top: "235px", left: "80px", fontSize: "16px", fontWeight: "bold" }}>{data.regNo || id}</div>
        <div style={{ position: "absolute", top: "265px", left: "80px", fontSize: "16px", fontWeight: "bold" }}>{new Date(data.issue_date).toLocaleDateString("en-GB")}</div>
      </div>
    </div>
  );
}
